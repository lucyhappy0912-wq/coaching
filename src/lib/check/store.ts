import "server-only";

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { requireAdmin } from "@/lib/auth/dal";
import { compute, type Answers, type CheckScores } from "./compute";
import { maskEmail, maskName, maskPhone } from "./mask";
import { CONSENT_VERSION, INSTRUMENT_VERSION, RETENTION_DAYS } from "./questions";

export type CheckRecord = {
  id: string;
  createdAt: string;
  instrument: "founder-transition-check";
  instrumentVersion: string;
  answers: Answers;
  identity: {
    name: string;
    phone: string;
    email: string;
    contactConsent: boolean;
    consentAt: string;
    consentVersion: string;
  };
  resultTokenHash: string;
  source: string;
  purgeAt: string;
  scores: Pick<CheckScores, "total" | "band" | "areas">;
};

export type CheckListItem = {
  id: string;
  createdAt: string;
  nameMasked: string;
  phoneMasked: string;
  emailMasked: string;
  band: CheckScores["band"];
  total: number;
  source: string;
  contactConsent: boolean;
};

const FILE = path.join(process.cwd(), "data", "checks.jsonl");
const PURGE_LOG = path.join(process.cwd(), "data", "check-purge-log.jsonl");

let writeChain: Promise<void> = Promise.resolve();

function assertWritable() {
  if (process.env.VERCEL) {
    throw new Error("CHECK_STORE_READONLY");
  }
}

function isWritable() {
  return !process.env.VERCEL;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function issueResultToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashToken(token) };
}

export type NewCheckInput = {
  answers: Answers;
  name: string;
  phone: string;
  email: string;
  contactConsent: boolean;
  source: string;
};

async function readAll(): Promise<CheckRecord[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as CheckRecord);
  } catch {
    return [];
  }
}

async function replaceAll(rows: CheckRecord[]) {
  assertWritable();
  await mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp-${randomBytes(8).toString("hex")}`;
  const body = rows.length ? `${rows.map((row) => JSON.stringify(row)).join("\n")}\n` : "";
  await writeFile(tmp, body, "utf8");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await rename(tmp, FILE);
      return;
    } catch {
      if (attempt === 2) {
        await unlink(tmp).catch(() => undefined);
        throw new Error("CHECK_STORE_WRITE_FAILED");
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

async function appendPurgeLog(entries: { recordId: string; reason: "retention" | "manual" }[]) {
  if (!isWritable() || entries.length === 0) return;
  const at = new Date().toISOString();
  const lines = entries
    .map((entry) => JSON.stringify({ recordId: entry.recordId, purgedAt: at, reason: entry.reason }))
    .join("\n");
  await mkdir(path.dirname(PURGE_LOG), { recursive: true });
  await appendFile(PURGE_LOG, `${lines}\n`, "utf8");
}

async function purgeExpired() {
  if (!isWritable()) return;
  writeChain = writeChain.then(async () => {
    const rows = await readAll();
    const now = Date.now();
    const keep: CheckRecord[] = [];
    const gone: string[] = [];
    for (const row of rows) {
      if (new Date(row.purgeAt).getTime() <= now) gone.push(row.id);
      else keep.push(row);
    }
    if (gone.length === 0) return;
    await replaceAll(keep);
    await appendPurgeLog(gone.map((recordId) => ({ recordId, reason: "retention" })));
  });
  await writeChain;
}

function isFresh(record: CheckRecord) {
  return new Date(record.purgeAt).getTime() > Date.now();
}

export async function saveCheck(input: NewCheckInput) {
  assertWritable();
  await purgeExpired();
  const scores = compute(input.answers);
  const createdAt = new Date();
  const { token, hash } = issueResultToken();
  const record: CheckRecord = {
    id: randomUUID(),
    createdAt: createdAt.toISOString(),
    instrument: "founder-transition-check",
    instrumentVersion: INSTRUMENT_VERSION,
    answers: input.answers,
    identity: {
      name: input.name,
      phone: input.phone,
      email: input.email,
      contactConsent: input.contactConsent,
      consentAt: createdAt.toISOString(),
      consentVersion: CONSENT_VERSION,
    },
    resultTokenHash: hash,
    source: input.source,
    purgeAt: new Date(createdAt.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    scores: { total: scores.total, band: scores.band, areas: scores.areas },
  };

  writeChain = writeChain.then(async () => {
    await mkdir(path.dirname(FILE), { recursive: true });
    await appendFile(FILE, `${JSON.stringify(record)}\n`, "utf8");
  });
  await writeChain;
  return { token, record, scores };
}

export async function getByToken(token: string) {
  if (isWritable()) await purgeExpired();
  const hash = hashToken(token);
  const rows = await readAll();
  const record = rows.find((row) => row.resultTokenHash === hash);
  if (!record || !isFresh(record)) return null;
  return { record, scores: compute(record.answers) };
}

export async function listChecksForAdmin(): Promise<CheckListItem[]> {
  await requireAdmin();
  if (isWritable()) await purgeExpired();
  const rows = (await readAll()).filter(isFresh);
  rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return rows.map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    nameMasked: maskName(row.identity.name),
    phoneMasked: maskPhone(row.identity.phone),
    emailMasked: maskEmail(row.identity.email),
    band: row.scores.band,
    total: row.scores.total,
    source: row.source,
    contactConsent: row.identity.contactConsent,
  }));
}

export async function getCheckForAdmin(id: string) {
  await requireAdmin();
  if (isWritable()) await purgeExpired();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await readAll();
  const record = rows.find((row) => row.id === id);
  if (!record || !isFresh(record)) return null;
  const { resultTokenHash: _hash, ...safe } = record;
  return { record: safe, scores: compute(record.answers) };
}

export async function removeCheckForAdmin(id: string) {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  assertWritable();
  let removed = false;
  writeChain = writeChain.then(async () => {
    const rows = await readAll();
    const keep = rows.filter((row) => row.id !== id);
    removed = keep.length !== rows.length;
    if (!removed) return;
    await replaceAll(keep);
    await appendPurgeLog([{ recordId: id, reason: "manual" }]);
  });
  await writeChain;
  return removed;
}
