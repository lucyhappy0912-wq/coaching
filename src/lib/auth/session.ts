import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import { readAuthMaterial } from "./material";

export const ADMIN_COOKIE = "__Host-admin_session";
export const SESSION_MAX_AGE = 28800;

type SessionPayload = {
  iat: number;
  exp: number;
  pv: string;
};

function b64urlEncode(buf: Buffer) {
  return buf.toString("base64url");
}

function b64urlDecode(value: string) {
  try {
    return Buffer.from(value, "base64url");
  } catch {
    return null;
  }
}

function sessionSecret() {
  const raw = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!raw) return null;
  const decoded = Buffer.from(raw, "base64");
  if (decoded.length >= 32) return decoded;
  if (raw.length >= 32) return createHash("sha256").update(raw).digest();
  return null;
}

export function passwordEpochStamp() {
  const material = readAuthMaterial();
  if (!material) return null;
  return createHash("sha256").update(`${material.hash}|${material.epoch}`).digest("hex").slice(0, 16);
}

export function adminAuthConfigured() {
  return Boolean(readAuthMaterial() && sessionSecret() && passwordEpochStamp());
}

function sign(payloadB64: string, secret: Buffer) {
  return createHmac("sha256", secret).update(`v1.${payloadB64}`).digest();
}

export function issueSessionToken() {
  const secret = sessionSecret();
  const pv = passwordEpochStamp();
  if (!secret || !pv) return null;
  const iat = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { iat, exp: iat + SESSION_MAX_AGE, pv };
  const payloadB64 = b64urlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
  const mac = sign(payloadB64, secret);
  return `v1.${payloadB64}.${b64urlEncode(mac)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const secret = sessionSecret();
  const pv = passwordEpochStamp();
  if (!secret || !pv) return null;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;
  const payloadB64 = parts[1];
  const mac = b64urlDecode(parts[2]);
  if (!mac || mac.length !== 32) return null;

  const expected = sign(payloadB64, secret);
  if (expected.length !== mac.length) return null;
  if (!timingSafeEqual(expected, mac)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }

  if (!Number.isInteger(payload.iat) || !Number.isInteger(payload.exp)) return null;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) return null;
  if (payload.exp - payload.iat > SESSION_MAX_AGE) return null;
  if (payload.pv !== pv) return null;
  return payload;
}
