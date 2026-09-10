import "server-only";

import { randomUUID } from "node:crypto";

import { compute } from "./compute";
import { CONSENT_VERSION, INSTRUMENT_VERSION, RETENTION_DAYS } from "./questions";
import type { CheckListItem, CheckRecord, NewCheckInput } from "./store-types";
import { supabaseConfig } from "./store-mode";
import { hashToken, issueResultToken } from "./token";

type Row = {
  id: string;
  created_at: string;
  instrument: string;
  instrument_version: string;
  answers: CheckRecord["answers"];
  name: string;
  phone: string;
  email: string;
  contact_consent: boolean;
  consent_at: string;
  consent_version: string;
  result_token_hash: string;
  source: string;
  purge_at: string;
  total: number;
  band: CheckRecord["scores"]["band"];
  areas: CheckRecord["scores"]["areas"];
};

function endpoint() {
  const { url, key, ok } = supabaseConfig();
  if (!ok) throw new Error("CHECK_STORE_READONLY");
  return { url, key };
}

async function rest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = endpoint();
  const method = init.method ?? "GET";
  const prefer =
    method === "GET"
      ? "return=representation"
      : method === "DELETE" || method === "POST"
        ? "return=representation"
        : "return=minimal";
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: prefer,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) throw new Error("CHECK_STORE_AUTH");
    if (
      res.status === 404 ||
      text.includes("PGRST205") ||
      text.includes("PGRST106") ||
      text.includes("does not exist")
    ) {
      throw new Error("CHECK_STORE_NO_TABLE");
    }
    throw new Error("CHECK_STORE_WRITE_FAILED");
  }
  if (!text) return [] as T;
  return JSON.parse(text) as T;
}

function toRecord(row: Row): CheckRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    instrument: "founder-transition-check",
    instrumentVersion: row.instrument_version,
    answers: row.answers,
    identity: {
      name: row.name,
      phone: row.phone,
      email: row.email,
      contactConsent: row.contact_consent,
      consentAt: row.consent_at,
      consentVersion: row.consent_version,
    },
    resultTokenHash: row.result_token_hash,
    source: row.source,
    purgeAt: row.purge_at,
    scores: { total: row.total, band: row.band, areas: row.areas },
  };
}

function toRow(record: CheckRecord): Row {
  return {
    id: record.id,
    created_at: record.createdAt,
    instrument: record.instrument,
    instrument_version: record.instrumentVersion,
    answers: record.answers,
    name: record.identity.name,
    phone: record.identity.phone,
    email: record.identity.email,
    contact_consent: record.identity.contactConsent,
    consent_at: record.identity.consentAt,
    consent_version: record.identity.consentVersion,
    result_token_hash: record.resultTokenHash,
    source: record.source,
    purge_at: record.purgeAt,
    total: record.scores.total,
    band: record.scores.band,
    areas: record.scores.areas,
  };
}

async function purgeExpired() {
  const now = new Date().toISOString();
  const gone = await rest<Pick<Row, "id">[]>(
    `check_responses?purge_at=lte.${encodeURIComponent(now)}&select=id`,
  );
  if (!Array.isArray(gone) || gone.length === 0) return;
  await rest<Row[]>(`check_responses?purge_at=lte.${encodeURIComponent(now)}`, { method: "DELETE" });
  await rest<unknown>("check_purge_log", {
    method: "POST",
    body: JSON.stringify(
      gone.map((row) => ({
        record_id: row.id,
        purged_at: now,
        reason: "retention",
      })),
    ),
  });
}

export async function saveCheckSupabase(input: NewCheckInput) {
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
  await rest<Row[]>("check_responses", {
    method: "POST",
    body: JSON.stringify(toRow(record)),
  });
  return { token, record, scores };
}

export async function getByTokenSupabase(token: string) {
  await purgeExpired();
  const hash = hashToken(token);
  const now = new Date().toISOString();
  const rows = await rest<Row[]>(
    `check_responses?result_token_hash=eq.${encodeURIComponent(hash)}&purge_at=gt.${encodeURIComponent(now)}&select=*`,
  );
  const row = rows[0];
  if (!row) return null;
  const record = toRecord(row);
  return { record, scores: compute(record.answers) };
}

export async function listChecksSupabase(): Promise<CheckListItem[]> {
  await purgeExpired();
  const now = new Date().toISOString();
  const rows = await rest<Row[]>(
    `check_responses?purge_at=gt.${encodeURIComponent(now)}&select=*&order=created_at.desc`,
  );
  return rows.map((row) => {
    const record = toRecord(row);
    return {
      id: record.id,
      createdAt: record.createdAt,
      name: record.identity.name,
      phone: record.identity.phone,
      email: record.identity.email,
      band: record.scores.band,
      total: record.scores.total,
      source: record.source,
      contactConsent: record.identity.contactConsent,
    };
  });
}

export async function getCheckSupabase(id: string) {
  await purgeExpired();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const now = new Date().toISOString();
  const rows = await rest<Row[]>(
    `check_responses?id=eq.${encodeURIComponent(id)}&purge_at=gt.${encodeURIComponent(now)}&select=*`,
  );
  const row = rows[0];
  if (!row) return null;
  const record = toRecord(row);
  const { resultTokenHash: _hash, ...safe } = record;
  return { record: safe, scores: compute(record.answers) };
}

export async function removeCheckSupabase(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  const deleted = await rest<Pick<Row, "id">[]>(`check_responses?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!Array.isArray(deleted) || deleted.length === 0) return false;
  await rest<unknown>("check_purge_log", {
    method: "POST",
    body: JSON.stringify({
      record_id: id,
      purged_at: new Date().toISOString(),
      reason: "manual",
    }),
  });
  return true;
}
