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

function looksHeic(buf: Buffer) {
  const brands = ftypBrands(buf);
  if (brands.some((item) => item === "avif" || item === "avis" || item === "avia")) return false;
  return brands.some((item) => ["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(item));
}

/** 로컬 업로드는 프로젝트의 public/uploads (이 PC는 F:\coaching). C 임시폴더를 쓰지 않는다. */
function uploadDir() {
  return path.join(process.cwd(), "public", "uploads");
}

async function writeLocal(file: File, name: string) {
  const dir = uploadDir();
  try {
    await mkdir(dir, { recursive: true });
    const dest = path.join(dir, name);
    if (path.dirname(dest) !== dir) throw new Error("CMS_MEDIA_WRITE");
    await pipeline(
      Readable.fromWeb(file.stream() as import("node:stream/web").ReadableStream),
      createWriteStream(dest),
    );
    const info = await stat(dest);
    if (info.size !== file.size) throw new Error("CMS_MEDIA_TRUNCATED");
    return { name, url: `/uploads/${name}` };
  } catch (error) {
    if (error instanceof Error && (error.message === "CMS_MEDIA_TRUNCATED" || error.message === "CMS_MEDIA_WRITE")) {
      throw error;
    }
    throw new Error("CMS_MEDIA_WRITE");
  }
}

async function writeLocalBuffer(buf: Buffer, name: string) {
  const dir = uploadDir();
  try {
    await mkdir(dir, { recursive: true });
    const dest = path.join(dir, name);
    if (path.dirname(dest) !== dir) throw new Error("CMS_MEDIA_WRITE");
    await writeFile(dest, buf);
    return { name, url: `/uploads/${name}` };
  } catch (error) {
    if (error instanceof Error && error.message === "CMS_MEDIA_WRITE") throw error;
    throw new Error("CMS_MEDIA_WRITE");
  }
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
  if (looksHeic(head)) throw new Error("CMS_MEDIA_HEIC");
  const kind = sniff(head);
  if (!kind) throw new Error("CMS_MEDIA_TYPE");
  if (expect === "image" && !isImage(kind)) throw new Error("CMS_MEDIA_TYPE");
  if (expect === "video" && isImage(kind)) throw new Error("CMS_MEDIA_TYPE");

  const limit = isImage(kind) ? IMAGE_MAX_BYTES : VIDEO_MAX_BYTES;
  if (file.size > limit) throw new Error("CMS_MEDIA_SIZE");

  const ext = isImage(kind) ? IMAGE_EXT[kind] : VIDEO_EXT[kind];
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;

  // 로컬(이 PC)은 항상 F:\coaching\public\uploads. 문답표용 Supabase 키가 있어도 사진을 원격으로 보내지 않는다.
  if (!process.env.VERCEL) {
    if (!isImage(kind)) return writeLocal(file, name);
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length !== file.size) throw new Error("CMS_MEDIA_TRUNCATED");
    return writeLocalBuffer(buf, name);
  }

  if (!isImage(kind)) throw new Error("CMS_STORE_READONLY");
  if (!cmsEnabled()) throw new Error("CMS_STORE_READONLY");

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length !== file.size) throw new Error("CMS_MEDIA_TRUNCATED");

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
