import "server-only";

import { requireAdmin } from "@/lib/auth/dal";

import {
  getByTokenJsonl,
  getCheckJsonl,
  listChecksJsonl,
  removeCheckJsonl,
  saveCheckJsonl,
} from "./store-jsonl";
import { checkStoreMode } from "./store-mode";
import {
  getByTokenSupabase,
  getCheckSupabase,
  listChecksSupabase,
  removeCheckSupabase,
  saveCheckSupabase,
} from "./store-supabase";
import type { CheckListItem, NewCheckInput } from "./store-types";

export type { CheckListItem, CheckRecord, NewCheckInput } from "./store-types";

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

export async function listChecksForAdmin(): Promise<CheckListItem[]> {
  await requireAdmin();
  const mode = checkStoreMode();
  if (mode === "readonly") return [];
  if (mode === "supabase") return listChecksSupabase();
  return listChecksJsonl();
}

export async function getCheckForAdmin(id: string) {
  await requireAdmin();
  const mode = checkStoreMode();
  if (mode === "readonly") return null;
  if (mode === "supabase") return getCheckSupabase(id);
  return getCheckJsonl(id);
}

export async function removeCheckForAdmin(id: string) {
  await requireAdmin();
  assertWritable();
  if (checkStoreMode() === "supabase") return removeCheckSupabase(id);
  return removeCheckJsonl(id);
}
