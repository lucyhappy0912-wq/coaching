import "server-only";

import { requireAdmin } from "@/lib/auth/dal";

import {
  getByTokenJsonl,
  getCheckJsonl,
  listChecksJsonl,
  removeCheckJsonl,
  saveCheckJsonl,
  updateCheckJsonl,
} from "./store-jsonl";
import { checkStoreMode } from "./store-mode";
import {
  getByTokenSupabase,
  getCheckSupabase,
  listChecksSupabase,
  removeCheckSupabase,
  saveCheckSupabase,
  updateCheckSupabase,
} from "./store-supabase";
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

export async function getByToken(token: string) {
  const mode = checkStoreMode();
  if (mode === "readonly") return null;
  if (mode === "supabase") return getByTokenSupabase(token);
  return getByTokenJsonl(token);
}

export async function listChecksForAdmin(nameQuery?: string): Promise<CheckListItem[]> {
  await requireAdmin();
  const mode = checkStoreMode();
  if (mode === "readonly") return [];
  const rows = mode === "supabase" ? await listChecksSupabase() : await listChecksJsonl();
  return filterByName(rows, nameQuery);
}

export async function getCheckForAdmin(id: string) {
  await requireAdmin();
  const mode = checkStoreMode();
  if (mode === "readonly") return null;
  if (mode === "supabase") return getCheckSupabase(id);
  return getCheckJsonl(id);
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
  return removeCheckJsonl(id);
}
