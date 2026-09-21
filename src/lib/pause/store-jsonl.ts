import "server-only";

import { randomBytes, randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { computePause, type PauseScores } from "./compute";
import { CONSENT_VERSION, INSTRUMENT_VERSION, RETENTION_DAYS } from "./questions";
import { hashToken, issueResultToken } from "@/lib/check/token";
import type { NewPauseInput, PauseListItem, PauseRecord } from "./store-types";

const FILE = path.join(process.cwd(), "data", "pause.jsonl");
const PURGE_LOG = path.join(process.cwd(), "data", "pause-purge-log.jsonl");

let writeChain: Promise<void> = Promise.resolve();

async function readAll(): Promise<PauseRecord[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as PauseRecord)
      .filter((row) => row.instrument === "pause-check");
  } catch {
    return [];
  }
}

async function replaceAll(rows: PauseRecord[]) {
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
  if (entries.length === 0) return;
  const at = new Date().toISOString();
  const lines = entries
    .map((entry) => JSON.stringify({ recordId: entry.recordId, purgedAt: at, reason: entry.reason }))
    .join("\n");
  await mkdir(path.dirname(PURGE_LOG), { recursive: true });
  await appendFile(PURGE_LOG, `${lines}\n`, "utf8");
}

async function purgeExpired() {
  writeChain = writeChain.then(async () => {
    const rows = await readAll();
    const now = Date.now();
    const keep: PauseRecord[] = [];
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

function isFresh(record: PauseRecord) {
  return new Date(record.purgeAt).getTime() > Date.now();
}

export async function savePauseJsonl(input: NewPauseInput) {
  await purgeExpired();
  const scores = computePause(input.answers);
  const createdAt = new Date();
  const { token, hash } = issueResultToken();
  const record: PauseRecord = {
    id: randomUUID(),
    createdAt: createdAt.toISOString(),
    instrument: "pause-check",
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
    scores: { total: scores.total, band: scores.band },
  };

  writeChain = writeChain.then(async () => {
    await mkdir(path.dirname(FILE), { recursive: true });
    await appendFile(FILE, `${JSON.stringify(record)}\n`, "utf8");
  });
  await writeChain;
  return { token, record, scores };
}

export async function getPauseScoresByIdentityJsonl(
  name: string,
  phone: string,
  email: string,
): Promise<PauseScores | null> {
  await purgeExpired();
  const match = (await readAll())
    .filter(isFresh)
    .filter(
      (row) =>
        row.identity.name.trim() === name &&
        row.identity.phone === phone &&
        row.identity.email === email,
    )
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
  if (!match) return null;
  return computePause(match.answers);
}

export async function getPauseByTokenJsonl(token: string) {
  await purgeExpired();
  const hash = hashToken(token);
  const rows = await readAll();
  const record = rows.find((row) => row.resultTokenHash === hash);
  if (!record || !isFresh(record)) return null;
  return { record, scores: computePause(record.answers) };
}

export async function listPauseJsonl(): Promise<PauseListItem[]> {
  await purgeExpired();
  const rows = (await readAll()).filter(isFresh);
  rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return rows.map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    name: row.identity.name,
    phone: row.identity.phone,
    email: row.identity.email,
    band: row.scores.band,
    total: row.scores.total,
    source: row.source,
    contactConsent: row.identity.contactConsent,
  }));
}

export async function getPauseJsonl(id: string) {
  await purgeExpired();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await readAll();
  const record = rows.find((row) => row.id === id);
  if (!record || !isFresh(record)) return null;
  const { resultTokenHash: _hash, ...safe } = record;
  return { record: safe, scores: computePause(record.answers) };
}

export async function removePauseJsonl(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
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
