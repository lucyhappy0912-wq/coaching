import "server-only";

import { randomBytes } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { cmsEnabled, cmsStorage, cmsWritable, mediaPublicUrl } from "./client";
import { IMAGE_MAX_BYTES, VIDEO_MAX_BYTES } from "./media-limits";

const IMAGE_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

const VIDEO_EXT = {
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
  "video/x-ms-wmv": "wmv",
  "video/webm": "webm",
  "video/mpeg": "mpg",
} as const;

type ImageKind = keyof typeof IMAGE_EXT;
type VideoKind = keyof typeof VIDEO_EXT;
type MediaKind = ImageKind | VideoKind;

export type MediaItem = { name: string; url: string; updatedAt: string };

function ascii(buf: Buffer, start: number, end: number) {
  return buf.toString("ascii", start, end);
}

function ftypBrands(buf: Buffer): string[] {
  if (buf.length < 16 || ascii(buf, 4, 8) !== "ftyp") return [];
  const size = buf.readUInt32BE(0);
  const end = Math.min(buf.length, size > 8 ? size : buf.length);
  const brands = [ascii(buf, 8, 12)];
  for (let i = 16; i + 4 <= end; i += 4) brands.push(ascii(buf, i, i + 4));
  return brands.map((item) => item.replace(/\0/g, "").trim()).filter(Boolean);
}

function sniff(buf: Buffer): MediaKind | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return "image/png";
  }
  if (buf.length >= 6 && ascii(buf, 0, 6) === "GIF87a") return "image/gif";
  if (buf.length >= 6 && ascii(buf, 0, 6) === "GIF89a") return "image/gif";
  if (buf.length >= 12 && ascii(buf, 0, 4) === "RIFF" && ascii(buf, 8, 12) === "WEBP") return "image/webp";
  if (buf.length >= 12 && ascii(buf, 0, 4) === "RIFF" && ascii(buf, 8, 12).trim() === "AVI") {
    return "video/x-msvideo";
  }

  const brands = ftypBrands(buf);
  if (brands.some((item) => item === "avif" || item === "avis" || item === "avia")) return "image/avif";
  if (brands.some((item) => item === "qt")) return "video/quicktime";
  if (brands.length) return "video/mp4";

  if (
    buf.length >= 16 &&
    buf[0] === 0x30 &&
    buf[1] === 0x26 &&
    buf[2] === 0xb2 &&
    buf[3] === 0x75 &&
    buf[4] === 0x8e &&
    buf[5] === 0x66 &&
    buf[6] === 0xcf &&
    buf[7] === 0x11
  ) {
    return "video/x-ms-wmv";
  }
  if (buf.length >= 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) {
    return "video/webm";
  }
  if (
    buf.length >= 4 &&
    buf[0] === 0x00 &&
    buf[1] === 0x00 &&
    buf[2] === 0x01 &&
    (buf[3] === 0xba || buf[3] === 0xb3)
  ) {
    return "video/mpeg";
  }
  return null;
}

function isImage(kind: MediaKind): kind is ImageKind {
  return kind.startsWith("image/");
}

function imageLooksComplete(kind: ImageKind, buf: Buffer) {
  if (kind === "image/jpeg") return buf.length >= 2 && buf[buf.length - 2] === 0xff && buf[buf.length - 1] === 0xd9;
  if (kind === "image/png") return buf.includes(Buffer.from("IEND"));
  if (kind === "image/gif") return buf[buf.length - 1] === 0x3b;
  if (kind === "image/webp") {
    const declared = buf.readUInt32LE(4);
    return buf.length >= 8 && declared + 8 === buf.length;
  }
  return buf.length >= 16;
}

async function writeLocal(file: File, name: string) {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, name);
  await pipeline(
    Readable.fromWeb(file.stream() as import("node:stream/web").ReadableStream),
    createWriteStream(dest),
  );
  const info = await stat(dest);
  if (info.size !== file.size) throw new Error("CMS_MEDIA_SIZE");
  return { name, url: `/uploads/${name}` };
}

export async function listMedia(): Promise<MediaItem[]> {
  if (!cmsEnabled()) return [];
  const res = await cmsStorage("object/list/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "", limit: 100, sortBy: { column: "created_at", order: "desc" } }),
  });
  if (!res.ok) return [];
  const rows = (await res.json()) as { name: string; updated_at?: string; created_at?: string }[];
  return rows
    .filter((row) => row.name && !row.name.endsWith("/"))
    .map((row) => ({
      name: row.name,
      url: mediaPublicUrl(row.name),
      updatedAt: row.updated_at ?? row.created_at ?? "",
    }));
}

export async function uploadMedia(file: File, expect?: "image" | "video") {
  if (!cmsWritable()) throw new Error("CMS_STORE_READONLY");
  if (file.size <= 0) throw new Error("CMS_MEDIA_SIZE");
  const head = Buffer.from(await file.slice(0, 64).arrayBuffer());
  const kind = sniff(head);
  if (!kind) throw new Error("CMS_MEDIA_TYPE");
  if (expect === "image" && !isImage(kind)) throw new Error("CMS_MEDIA_TYPE");
  if (expect === "video" && isImage(kind)) throw new Error("CMS_MEDIA_TYPE");

  const limit = isImage(kind) ? IMAGE_MAX_BYTES : VIDEO_MAX_BYTES;
  if (file.size > limit) throw new Error("CMS_MEDIA_SIZE");

  const ext = isImage(kind) ? IMAGE_EXT[kind] : VIDEO_EXT[kind];
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;

  if (!isImage(kind)) {
    if (process.env.VERCEL) throw new Error("CMS_STORE_READONLY");
    return writeLocal(file, name);
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length !== file.size || !imageLooksComplete(kind, buf)) throw new Error("CMS_MEDIA_SIZE");

  if (!cmsEnabled()) {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), buf);
    return { name, url: `/uploads/${name}` };
  }

  const res = await cmsStorage(`object/media/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": kind,
      "x-upsert": "false",
    },
    body: new Uint8Array(buf),
  });
  if (!res.ok) throw new Error("CMS_STORE_FAILED");
  return { name, url: mediaPublicUrl(name) };
}

export async function removeMedia(name: string) {
  if (!cmsEnabled() || !/^[a-zA-Z0-9._-]+$/.test(name)) return false;
  const res = await cmsStorage(`object/media/${name}`, { method: "DELETE" });
  return res.ok;
}
