import "server-only";

import { createHash, randomBytes } from "node:crypto";

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function issueResultToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashToken(token) };
}
