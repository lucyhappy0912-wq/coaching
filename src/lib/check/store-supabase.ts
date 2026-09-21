import "server-only";

import { randomUUID } from "node:crypto";

import { compute, isLikert, type Answers, type CheckScores } from "./compute";
import { CONSENT_VERSION, INSTRUMENT_VERSION, QUESTIONS, RETENTION_DAYS } from "./questions";
import { computePause, isLikert as isPauseLikert, type PauseAnswers } from "@/lib/pause/compute";
import {
  CONSENT_VERSION as PAUSE_CONSENT_VERSION,
  INSTRUMENT_VERSION as PAUSE_INSTRUMENT_VERSION,
  PAUSE_INSTRUMENT,
  PAUSE_QUESTIONS,
  RETENTION_DAYS as PAUSE_RETENTION_DAYS,
} from "@/lib/pause/questions";
import type { NewPauseInput, PauseRecord } from "@/lib/pause/store-types";
import type { CheckInstrument, CheckListItem, CheckRecord, CheckUpdateInput, NewCheckInput } from "./store-types";
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
  industry?: string;
  founder_journey?: string;
  contact_consent: boolean;
  consent_at: string;
  consent_version: string;
  result_token_hash: string;
  source: string;
  purge_at: string;
  total: number;
  band: string;
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
    const hint = /PGRST\d+/.exec(text)?.[0] ?? /22P02|23502|23505/.exec(text)?.[0] ?? String(res.status);
    if (res.status === 401 || res.status === 403) throw new Error("CHECK_STORE_AUTH");
    if (
      res.status === 404 ||
      text.includes("PGRST205") ||
      text.includes("PGRST106") ||
      text.includes("does not exist")
    ) {
      throw new Error("CHECK_STORE_NO_TABLE");
    }
    if (text.includes("PGRST204")) throw new Error(`CHECK_STORE_MISSING_COLUMN:${hint}`);
    throw new Error(`CHECK_STORE_WRITE_FAILED:${hint}`);
  }
  if (!text) return [] as T;
  return JSON.parse(text) as T;
}

const INDUSTRY_KEY = "__industry";
const JOURNEY_KEY = "__founderJourney";

function packAnswers(answers: Answers, industry: string, founderJourney: string) {
  return { ...answers, [INDUSTRY_KEY]: industry, [JOURNEY_KEY]: founderJourney };
}

function unpackAnswers(raw: unknown) {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const answers = {} as Answers;
  for (const q of QUESTIONS) {
    const n = Number(obj[q.key]);
    if (isLikert(n)) answers[q.key] = n;
  }
  return {
    answers,
    industry: typeof obj[INDUSTRY_KEY] === "string" ? obj[INDUSTRY_KEY] : "",
    founderJourney: typeof obj[JOURNEY_KEY] === "string" ? obj[JOURNEY_KEY] : "",
  };
}

function unpackPauseAnswers(raw: unknown): PauseAnswers | null {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const answers = {} as PauseAnswers;
  for (const q of PAUSE_QUESTIONS) {
    const n = Number(obj[q.key]);
    if (!isPauseLikert(n)) return null;
    answers[q.key] = n;
  }
  return answers;
}

function isPauseInstrument(value: string) {
  return value === PAUSE_INSTRUMENT;
}

function toRecord(row: Row): CheckRecord {
  const packed = unpackAnswers(row.answers);
  return {
    id: row.id,
    createdAt: row.created_at,
    instrument: "founder-transition-check",
    instrumentVersion: row.instrument_version,
    answers: packed.answers,
    identity: {
      name: row.name,
      phone: row.phone,
      email: row.email,
      industry: (row.industry ?? "").trim() || packed.industry,
      founderJourney: (row.founder_journey ?? "").trim() || packed.founderJourney,
      contactConsent: row.contact_consent,
      consentAt: row.consent_at,
      consentVersion: row.consent_version,
    },
    resultTokenHash: row.result_token_hash,
    source: row.source,
    purgeAt: row.purge_at,
    scores: { total: row.total, band: row.band as CheckRecord["scores"]["band"], areas: row.areas },
  };
}

function toCoreRow(record: CheckRecord) {
  return {
    id: record.id,
    created_at: record.createdAt,
    instrument: record.instrument,
    instrument_version: record.instrumentVersion,
    answers: packAnswers(record.answers, record.identity.industry, record.identity.founderJourney),
    name: record.identity.name,
    phone: record.identity.phone,
    email: record.identity.email,
    industry: record.identity.industry,
    founder_journey: record.identity.founderJourney,
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
  try {
    const now = new Date().toISOString();
    const gone = await rest<Pick<Row, "id">[]>(
      `check_responses?purge_at=lte.${encodeURIComponent(now)}&select=id`,
    );
    if (!Array.isArray(gone) || gone.length === 0) return;
    await rest<Row[]>(`check_responses?purge_at=lte.${encodeURIComponent(now)}`, { method: "DELETE" });
    try {
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
    } catch {
      // 파기 기록은 제출을 막지 않는다.
    }
  } catch {
    // 만료 정리는 제출을 막지 않는다.
  }
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
  const row = toCoreRow(record);
  try {
    await rest<Row[]>("check_responses", {
      method: "POST",
      body: JSON.stringify(row),
    });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.startsWith("CHECK_STORE_MISSING_COLUMN")) {
      throw error;
    }
    const { industry: _i, founder_journey: _j, ...withoutProfileColumns } = row;
    await rest<Row[]>("check_responses", {
      method: "POST",
      body: JSON.stringify(withoutProfileColumns),
    });
  }
  return { token, record, scores };
}

export async function getScoresByIdentitySupabase(
  name: string,
  phone: string,
  email: string,
): Promise<CheckScores | null> {
  await purgeExpired();
  const now = new Date().toISOString();
  const rows = await rest<Pick<Row, "answers">[]>(
    `check_responses?instrument=eq.founder-transition-check&name=eq.${encodeURIComponent(name)}&phone=eq.${encodeURIComponent(phone)}&email=eq.${encodeURIComponent(email)}&purge_at=gt.${encodeURIComponent(now)}&select=answers&order=created_at.desc&limit=1`,
  );
  const row = rows[0];
  if (!row) return null;
  return compute(unpackAnswers(row.answers).answers);
}

export async function getByTokenSupabase(token: string) {
  await purgeExpired();
  const hash = hashToken(token);
  const now = new Date().toISOString();
  const rows = await rest<Row[]>(
    `check_responses?instrument=eq.founder-transition-check&result_token_hash=eq.${encodeURIComponent(hash)}&purge_at=gt.${encodeURIComponent(now)}&select=*`,
  );
  const row = rows[0];
  if (!row || isPauseInstrument(row.instrument)) return null;
  const record = toRecord(row);
  return { record, scores: compute(record.answers) };
}

const LIST_SELECT_CORE =
  "id,created_at,name,phone,email,instrument,band,total,source,contact_consent";
const LIST_SELECT_PROFILE = `${LIST_SELECT_CORE},industry,founder_journey`;

type CheckListRow = Pick<
  Row,
  "id" | "created_at" | "name" | "phone" | "email" | "instrument" | "band" | "total" | "source" | "contact_consent"
> & {
  industry?: string;
  founder_journey?: string;
};

function mapCheckListRow(row: CheckListRow): CheckListItem {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    email: row.email,
    industry: (row.industry ?? "").trim(),
    founderJourney: (row.founder_journey ?? "").trim(),
    instrument: isPauseInstrument(row.instrument) ? "pause-check" : "founder-transition-check",
    band: row.band,
    total: row.total,
    source: row.source,
    contactConsent: row.contact_consent,
  };
}

export async function countChecksSupabase() {
  const now = new Date().toISOString();
  const rows = await rest<{ id: string }[]>(
    `check_responses?purge_at=gt.${encodeURIComponent(now)}&select=id`,
  );
  return rows.length;
}

export async function listChecksSupabase(): Promise<CheckListItem[]> {
  const now = new Date().toISOString();
  const path = (select: string) =>
    `check_responses?purge_at=gt.${encodeURIComponent(now)}&select=${select}&order=created_at.desc`;
  let rows: CheckListRow[];
  try {
    rows = await rest<CheckListRow[]>(path(LIST_SELECT_PROFILE));
  } catch (error) {
    if (!(error instanceof Error) || !error.message.startsWith("CHECK_STORE_MISSING_COLUMN")) {
      throw error;
    }
    rows = await rest<CheckListRow[]>(path(LIST_SELECT_CORE));
  }
  return rows.map(mapCheckListRow);
}

export async function getCheckSupabase(id: string) {
  await purgeExpired();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const now = new Date().toISOString();
  const rows = await rest<Row[]>(
    `check_responses?instrument=eq.founder-transition-check&id=eq.${encodeURIComponent(id)}&purge_at=gt.${encodeURIComponent(now)}&select=*`,
  );
  const row = rows[0];
  if (!row || isPauseInstrument(row.instrument)) return null;
  const record = toRecord(row);
  const { resultTokenHash: _hash, ...safe } = record;
  return { record: safe, scores: compute(record.answers) };
}

export async function savePauseSupabase(input: NewPauseInput) {
  await purgeExpired();
  const scores = computePause(input.answers);
  const createdAt = new Date();
  const { token, hash } = issueResultToken();
  const record: PauseRecord = {
    id: randomUUID(),
    createdAt: createdAt.toISOString(),
    instrument: PAUSE_INSTRUMENT,
    instrumentVersion: PAUSE_INSTRUMENT_VERSION,
    answers: input.answers,
    identity: {
      name: input.name,
      phone: input.phone,
      email: input.email,
      contactConsent: input.contactConsent,
      consentAt: createdAt.toISOString(),
      consentVersion: PAUSE_CONSENT_VERSION,
    },
    resultTokenHash: hash,
    source: input.source,
    purgeAt: new Date(createdAt.getTime() + PAUSE_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    scores: { total: scores.total, band: scores.band },
  };
  const row = {
    id: record.id,
    created_at: record.createdAt,
    instrument: record.instrument,
    instrument_version: record.instrumentVersion,
    answers: record.answers,
    name: record.identity.name,
    phone: record.identity.phone,
    email: record.identity.email,
    industry: "",
    founder_journey: "",
    contact_consent: record.identity.contactConsent,
    consent_at: record.identity.consentAt,
    consent_version: record.identity.consentVersion,
    result_token_hash: record.resultTokenHash,
    source: record.source,
    purge_at: record.purgeAt,
    total: record.scores.total,
    band: record.scores.band,
    areas: {},
  };
  try {
    await rest<Row[]>("check_responses", {
      method: "POST",
      body: JSON.stringify(row),
    });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.startsWith("CHECK_STORE_MISSING_COLUMN")) {
      throw error;
    }
    const { industry: _i, founder_journey: _j, ...withoutProfileColumns } = row;
    await rest<Row[]>("check_responses", {
      method: "POST",
      body: JSON.stringify(withoutProfileColumns),
    });
  }
  return { token, record, scores };
}

export async function getPauseScoresByIdentitySupabase(name: string, phone: string, email: string) {
  await purgeExpired();
  const now = new Date().toISOString();
  const rows = await rest<Pick<Row, "answers">[]>(
    `check_responses?instrument=eq.pause-check&name=eq.${encodeURIComponent(name)}&phone=eq.${encodeURIComponent(phone)}&email=eq.${encodeURIComponent(email)}&purge_at=gt.${encodeURIComponent(now)}&select=answers&order=created_at.desc&limit=1`,
  );
  const row = rows[0];
  if (!row) return null;
  const answers = unpackPauseAnswers(row.answers);
  if (!answers) return null;
  return computePause(answers);
}

export async function getPauseByTokenSupabase(token: string) {
  await purgeExpired();
  const hash = hashToken(token);
  const now = new Date().toISOString();
  const rows = await rest<Row[]>(
    `check_responses?instrument=eq.pause-check&result_token_hash=eq.${encodeURIComponent(hash)}&purge_at=gt.${encodeURIComponent(now)}&select=*`,
  );
  const row = rows[0];
  if (!row || !isPauseInstrument(row.instrument)) return null;
  const answers = unpackPauseAnswers(row.answers);
  if (!answers) return null;
  const record: PauseRecord = {
    id: row.id,
    createdAt: row.created_at,
    instrument: PAUSE_INSTRUMENT,
    instrumentVersion: row.instrument_version,
    answers,
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
    scores: { total: row.total, band: computePause(answers).band },
  };
  return { record, scores: computePause(answers) };
}

export async function getPauseSupabase(id: string) {
  await purgeExpired();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const now = new Date().toISOString();
  const rows = await rest<Row[]>(
    `check_responses?instrument=eq.pause-check&id=eq.${encodeURIComponent(id)}&purge_at=gt.${encodeURIComponent(now)}&select=*`,
  );
  const row = rows[0];
  if (!row || !isPauseInstrument(row.instrument)) return null;
  const answers = unpackPauseAnswers(row.answers);
  if (!answers) return null;
  const scores = computePause(answers);
  const record: PauseRecord = {
    id: row.id,
    createdAt: row.created_at,
    instrument: PAUSE_INSTRUMENT,
    instrumentVersion: row.instrument_version,
    answers,
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
    scores: { total: scores.total, band: scores.band },
  };
  const { resultTokenHash: _hash, ...safe } = record;
  return { record: safe, scores };
}

export async function updateCheckSupabase(id: string, input: CheckUpdateInput) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  await purgeExpired();
  const found = await getCheckSupabase(id);
  if (!found) return false;
  const scores = compute(input.answers);
  const contactConsent = found.record.identity.contactConsent && input.contactConsent;
  const core = {
    name: input.name,
    phone: input.phone,
    email: input.email,
    contact_consent: contactConsent,
    answers: packAnswers(input.answers, input.industry, input.founderJourney),
    total: scores.total,
    band: scores.band,
    areas: scores.areas,
  };
  try {
    await rest<unknown>(`check_responses?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...core,
        industry: input.industry,
        founder_journey: input.founderJourney,
      }),
    });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.startsWith("CHECK_STORE_MISSING_COLUMN")) {
      throw error;
    }
    await rest<unknown>(`check_responses?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(core),
    });
  }
  return true;
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
