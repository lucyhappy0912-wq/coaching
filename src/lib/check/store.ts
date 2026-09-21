import "server-only";

import { cache } from "react";

import { requireAdmin } from "@/lib/auth/dal";

import {
  getByTokenJsonl,
  getCheckJsonl,
  getScoresByIdentityJsonl,
  listChecksJsonl,
  removeCheckJsonl,
  saveCheckJsonl,
  updateCheckJsonl,
} from "./store-jsonl";
import { checkStoreMode } from "./store-mode";
import {
  countChecksSupabase,
  getByTokenSupabase,
  getCheckSupabase,
  getPauseByTokenSupabase,
  getPauseScoresByIdentitySupabase,
  getPauseSupabase,
  getScoresByIdentitySupabase,
  listChecksSupabase,
  removeCheckSupabase,
  saveCheckSupabase,
  savePauseSupabase,
  updateCheckSupabase,
} from "./store-supabase";
import {
  getPauseByTokenJsonl,
  getPauseJsonl,
  getPauseScoresByIdentityJsonl,
  listPauseJsonl,
  removePauseJsonl,
  savePauseJsonl,
} from "@/lib/pause/store-jsonl";
import type { PauseScores } from "@/lib/pause/compute";
import type { NewPauseInput } from "@/lib/pause/store-types";
import type { CheckScores } from "./compute";
import type { CheckListItem, CheckUpdateInput, NewCheckInput } from "./store-types";

export type { CheckListItem, CheckRecord, CheckUpdateInput, NewCheckInput } from "./store-types";

const NAME_QUERY_MAX = 80;

function filterByName(rows: CheckListItem[], nameQuery?: string) {
  const q = (nameQuery ?? "").trim().slice(0, NAME_QUERY_MAX).toLocaleLowerCase("ko");
  if (!q) return rows;
  return rows.filter((row) => row.name.toLocaleLowerCase("ko").includes(q));
}

function assertWritable() {
  if (checkStoreMode() === "readonly") throw new Error("CHECK_STORE_READONLY");
}

export async function saveCheck(input: NewCheckInput) {
  assertWritable();
  if (checkStoreMode() === "supabase") return saveCheckSupabase(input);
  return saveCheckJsonl(input);
}

export async function savePauseCheck(input: NewPauseInput) {
  assertWritable();
  if (checkStoreMode() === "supabase") return savePauseSupabase(input);
  return savePauseJsonl(input);
}

export async function getByToken(token: string) {
  const mode = checkStoreMode();
  if (mode === "readonly") return null;
  if (mode === "supabase") return getByTokenSupabase(token);
  return getByTokenJsonl(token);
}

export async function getScoresByIdentity(
  name: string,
  phone: string,
  email: string,
): Promise<CheckScores | null> {
  const mode = checkStoreMode();
  if (mode === "readonly") return null;
  if (mode === "supabase") return getScoresByIdentitySupabase(name, phone, email);
  return getScoresByIdentityJsonl(name, phone, email);
}

export async function getPauseByToken(token: string) {
  const mode = checkStoreMode();
  if (mode === "readonly") return null;
  if (mode === "supabase") return getPauseByTokenSupabase(token);
  return getPauseByTokenJsonl(token);
}

export async function getPauseScoresByIdentity(
  name: string,
  phone: string,
  email: string,
): Promise<PauseScores | null> {
  const mode = checkStoreMode();
  if (mode === "readonly") return null;
  if (mode === "supabase") return getPauseScoresByIdentitySupabase(name, phone, email);
  return getPauseScoresByIdentityJsonl(name, phone, email);
}

function toPauseListItem(row: {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  band: string;
  total: number;
  source: string;
  contactConsent: boolean;
}): CheckListItem {
  return {
    id: row.id,
    createdAt: row.createdAt,
    name: row.name,
    phone: row.phone,
    email: row.email,
    industry: "",
    founderJourney: "",
    instrument: "pause-check",
    band: row.band,
    total: row.total,
    source: row.source,
    contactConsent: row.contactConsent,
  };
}

export const listChecksForAdmin = cache(async (nameQuery?: string): Promise<CheckListItem[]> => {
  await requireAdmin();
  const mode = checkStoreMode();
  if (mode === "readonly") return [];
  try {
    if (mode === "supabase") return filterByName(await listChecksSupabase(), nameQuery);
    const [founder, pause] = await Promise.all([listChecksJsonl(), listPauseJsonl()]);
    const rows = [...founder, ...pause.map(toPauseListItem)].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1,
    );
    return filterByName(rows, nameQuery);
  } catch {
    return [];
  }
});

export async function countChecksForAdmin() {
  await requireAdmin();
  const mode = checkStoreMode();
  if (mode === "readonly") return 0;
  if (mode === "supabase") return countChecksSupabase();
  const [founder, pause] = await Promise.all([listChecksJsonl(), listPauseJsonl()]);
  return founder.length + pause.length;
}

export async function getCheckForAdmin(id: string) {
  await requireAdmin();
  const mode = checkStoreMode();
  if (mode === "readonly") return null;
  if (mode === "supabase") return getCheckSupabase(id);
  return getCheckJsonl(id);
}

export async function getPauseCheckForAdmin(id: string) {
  await requireAdmin();
  const mode = checkStoreMode();
  if (mode === "readonly") return null;
  if (mode === "supabase") return getPauseSupabase(id);
  return getPauseJsonl(id);
}

export async function updateCheckForAdmin(id: string, input: CheckUpdateInput) {
  await requireAdmin();
  assertWritable();
  if (checkStoreMode() === "supabase") return updateCheckSupabase(id, input);
  return updateCheckJsonl(id, input);
}

export async function removeCheckForAdmin(id: string) {
  await requireAdmin();
  assertWritable();
  if (checkStoreMode() === "supabase") return removeCheckSupabase(id);
  const founder = await removeCheckJsonl(id);
  if (founder) return true;
  return removePauseJsonl(id);
}
