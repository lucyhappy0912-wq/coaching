import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

function secret() {
  const raw = (process.env.ADMIN_SESSION_SECRET ?? process.env.SUPABASE_SECRET_KEY ?? "").trim();
  if (raw) return createHash("sha256").update(raw).digest();
  return createHash("sha256").update("board-unlock-local").digest();
}

function tokenOf(id: string) {
  return createHmac("sha256", secret()).update(id).digest("base64url");
}

function cookieName(id: string) {
  return `bq_${id.replace(/-/g, "").slice(0, 24)}`;
}

export async function isBoardUnlocked(id: string) {
  const value = (await cookies()).get(cookieName(id))?.value;
  if (!value) return false;
  const expected = Buffer.from(tokenOf(id));
  const got = Buffer.from(value);
  if (expected.length !== got.length) return false;
  return timingSafeEqual(expected, got);
}

export async function setBoardUnlock(id: string) {
  (await cookies()).set({
    name: cookieName(id),
    value: tokenOf(id),
    httpOnly: true,
    secure: Boolean(process.env.VERCEL),
    sameSite: "lax",
    path: "/board",
    maxAge: 60 * 60 * 24 * 7,
  });
}
