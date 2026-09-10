import { randomBytes, scrypt } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const envPath = path.join(root, ".env.local");
const N = 16384;
const r = 8;
const p = 1;

const requested = process.argv.slice(2).join("").trim();
const password = requested || randomBytes(18).toString("base64url");

function deriveKey(plain, salt) {
  return new Promise((resolve, reject) => {
    scrypt(plain, salt, 32, { N, r, p }, (error, derived) => {
      if (error) reject(error);
      else resolve(derived);
    });
  });
}

function upsert(src, name, value) {
  const line = `${name}=${value}`;
  const re = new RegExp(`^${name}=.*$`, "m");
  if (re.test(src)) return src.replace(re, line);
  return `${src.trimEnd()}${src ? "\n" : ""}${line}\n`;
}

function readEpoch(src) {
  const match = src.match(/^ADMIN_SESSION_EPOCH=(\d+)\s*$/m);
  return match ? Number(match[1]) : 0;
}

const salt = randomBytes(16);
const key = await deriveKey(password, salt);
const hash = `scrypt:${N}:${r}:${p}:${salt.toString("base64")}:${Buffer.from(key).toString("base64")}`;

let existing = "";
try {
  existing = await readFile(envPath, "utf8");
} catch {
  existing = "";
}

let next = existing;
next = upsert(next, "ADMIN_PASSWORD_HASH", hash);
if (!/^ADMIN_SESSION_SECRET=.+$/m.test(next)) {
  next = upsert(next, "ADMIN_SESSION_SECRET", randomBytes(32).toString("base64"));
}
next = upsert(next, "ADMIN_SESSION_EPOCH", String(readEpoch(next) + 1));

await writeFile(envPath, next.endsWith("\n") ? next : `${next}\n`, "utf8");
process.stdout.write(requested ? "admin password updated\n" : `${password}\n`);
