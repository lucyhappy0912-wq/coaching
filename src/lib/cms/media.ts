import "server-only";

import { randomBytes } from "node:crypto";

import { cmsEnabled, cmsStorage, mediaPublicUrl } from "./client";

const ALLOWED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

const MAX_BYTES = 5 * 1024 * 1024;

function sniff(buf: Buffer): keyof typeof ALLOWED | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export type MediaItem = { name: string; url: string; updatedAt: string };

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

export async function uploadMedia(file: File) {
  if (!cmsEnabled()) throw new Error("CMS_STORE_READONLY");
  if (file.size <= 0 || file.size > MAX_BYTES) throw new Error("CMS_MEDIA_SIZE");
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length !== file.size) throw new Error("CMS_MEDIA_SIZE");
  const kind = sniff(buf);
  if (!kind || !(file.type in ALLOWED) || ALLOWED[file.type as keyof typeof ALLOWED] !== ALLOWED[kind]) {
    throw new Error("CMS_MEDIA_TYPE");
  }
  const ext = ALLOWED[kind];
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
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
