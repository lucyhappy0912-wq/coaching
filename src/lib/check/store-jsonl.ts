import "server-only";

import { randomBytes, randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { compute } from "./compute";
import { CONSENT_VERSION, INSTRUMENT_VERSION, RETENTION_DAYS } from "./questions";
import { hashToken, issueResultToken } from "./token";
import type { CheckListItem, CheckRecord, CheckUpdateInput, NewCheckInput } from "./store-types";

const FILE = path.join(process.cwd(), "data", "checks.jsonl");
const PURGE_LOG = path.join(process.cwd(), "data", "check-purge-log.jsonl");

let writeChain: Promise<void> = Promise.resolve();

async function readAll(): Promise<CheckRecord[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const row = JSON.parse(line) as CheckRecord;
        return {
          ...row,
          identity: {
            ...row.identity,
            industry: row.identity.industry ?? "",
            founderJourney: row.identity.founderJourney ?? "",
          },
        };
      });
  } catch {
    return [];
  }
}

async function replaceAll(rows: CheckRecord[]) {
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

export async function saveCheckJsonl(input: NewCheckInput) {
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
      industry: input.industry,
      founderJourney: input.founderJourney,
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

export async function getByTokenJsonl(token: string) {
  await purgeExpired();
  const hash = hashToken(token);
  const rows = await readAll();
  const record = rows.find((row) => row.resultTokenHash === hash);
  if (!record || !isFresh(record)) return null;
  return { record, scores: compute(record.answers) };
}

export async function listChecksJsonl(): Promise<CheckListItem[]> {
  await purgeExpired();
  const rows = (await readAll()).filter(isFresh);
  rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return rows.map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    name: row.identity.name,
    phone: row.identity.phone,
    email: row.identity.email,
    industry: row.identity.industry ?? "",
    founderJourney: row.identity.founderJourney ?? "",
    band: row.scores.band,
    total: row.scores.total,
    source: row.source,
    contactConsent: row.identity.contactConsent,
  }));
}

export async function getCheckJsonl(id: string) {
  await purgeExpired();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await readAll();
  const record = rows.find((row) => row.id === id);
  if (!record || !isFresh(record)) return null;
  const { resultTokenHash: _hash, ...safe } = record;
  return { record: safe, scores: compute(record.answers) };
}

export async function updateCheckJsonl(id: string, input: CheckUpdateInput) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  await purgeExpired();
  const scores = compute(input.answers);
  let updated = false;
  writeChain = writeChain.then(async () => {
    const rows = await readAll();
    const index = rows.findIndex((row) => row.id === id);
    if (index < 0 || !isFresh(rows[index])) return;
    const prev = rows[index];
    rows[index] = {
      ...prev,
      answers: input.answers,
      identity: {
        ...prev.identity,
        name: input.name,
        phone: input.phone,
        email: input.email,
        industry: input.industry,
        founderJourney: input.founderJourney,
        contactConsent: prev.identity.contactConsent && input.contactConsent,
      },
      scores: { total: scores.total, band: scores.band, areas: scores.areas },
    };
    await replaceAll(rows);
    updated = true;
  });
  await writeChain;
  return updated;
}

export async function removeCheckJsonl(id: string) {
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
