import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LEN = 32;
const SALT_LEN = 16;
const N = 16384;
const R = 8;
const P = 1;

function deriveKey(plain: string, salt: Buffer, opts: { N: number; r: number; p: number }) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(plain, salt, KEY_LEN, opts, (error, derived) => {
      if (error) reject(error);
      else resolve(derived);
    });
  });
}

type ParsedHash = {
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  key: Buffer;
};

export function parsePasswordHash(stored: string): ParsedHash | null {
  const parts = stored.split(/[$:]/);
  if (parts.length !== 6 || parts[0] !== "scrypt") return null;
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return null;
  if (n < 2 || r < 1 || p < 1) return null;
  try {
    const salt = Buffer.from(parts[4], "base64");
    const key = Buffer.from(parts[5], "base64");
    if (salt.length !== SALT_LEN || key.length !== KEY_LEN) return null;
    return { N: n, r, p, salt, key };
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_LEN);
  const key = await deriveKey(plain, salt, { N, r: R, p: P });
  return `scrypt:${N}:${R}:${P}:${salt.toString("base64")}:${key.toString("base64")}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const parsed = parsePasswordHash(stored);
  if (!parsed) return false;
  const derived = await deriveKey(plain, parsed.salt, {
    N: parsed.N,
    r: parsed.r,
    p: parsed.p,
  });
  if (derived.length !== parsed.key.length) return false;
  return timingSafeEqual(derived, parsed.key);
}
