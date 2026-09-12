import { readFileSync } from "node:fs";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";

import { parsePasswordHash } from "./password";

const AUTH_FILE = path.join(process.cwd(), "data", "admin-auth.json");
const ENV_FILE = path.join(process.cwd(), ".env.local");

export type AuthMaterial = {
  hash: string;
  epoch: string;
};

function asMaterial(value: unknown): AuthMaterial | null {
  if (!value || typeof value !== "object") return null;
  const hash = "hash" in value && typeof value.hash === "string" ? value.hash.trim() : "";
  if (!hash || !parsePasswordHash(hash)) return null;
  const epoch =
    "epoch" in value && (typeof value.epoch === "string" || typeof value.epoch === "number")
      ? String(value.epoch).trim()
      : "0";
  return { hash, epoch: epoch || "0" };
}

function readAuthFileSync(): AuthMaterial | null {
  try {
    return asMaterial(JSON.parse(readFileSync(AUTH_FILE, "utf8")));
  } catch {
    return null;
  }
}

export function readAuthMaterial(): AuthMaterial | null {
  const file = readAuthFileSync();
  if (file) return file;
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";
  if (!hash || !parsePasswordHash(hash)) return null;
  return { hash, epoch: (process.env.ADMIN_SESSION_EPOCH ?? "0").trim() || "0" };
}

export function authWritable() {
  return !process.env.VERCEL;
}

function upsertEnv(src: string, name: string, value: string) {
  const line = `${name}=${value}`;
  const re = new RegExp(`^${name}=.*$`, "m");
  if (re.test(src)) return src.replace(re, line);
  return `${src.trimEnd()}${src ? "\n" : ""}${line}\n`;
}

async function writeAuthFile(material: AuthMaterial) {
  await mkdir(path.dirname(AUTH_FILE), { recursive: true });
  const tmp = `${AUTH_FILE}.tmp-${randomBytes(8).toString("hex")}`;
  await writeFile(tmp, `${JSON.stringify(material)}\n`, "utf8");
  try {
    await rename(tmp, AUTH_FILE);
  } catch {
    await unlink(tmp).catch(() => undefined);
    throw new Error("AUTH_STORE_WRITE_FAILED");
  }
}

async function writeEnvLocal(hash: string, epoch: string) {
  let existing = "";
  try {
    existing = await readFile(ENV_FILE, "utf8");
  } catch {
    existing = "";
  }
  let next = existing;
  next = upsertEnv(next, "ADMIN_PASSWORD_HASH", hash);
  next = upsertEnv(next, "ADMIN_SESSION_EPOCH", epoch);
  await writeFile(ENV_FILE, next.endsWith("\n") ? next : `${next}\n`, "utf8");
}

export async function persistPasswordHash(hash: string) {
  if (!authWritable()) throw new Error("AUTH_STORE_READONLY");
  if (!parsePasswordHash(hash)) throw new Error("AUTH_HASH_INVALID");
  const current = readAuthMaterial();
  const epoch = String((Number(current?.epoch ?? 0) || 0) + 1);
  await writeAuthFile({ hash, epoch });
  await writeEnvLocal(hash, epoch);
}
