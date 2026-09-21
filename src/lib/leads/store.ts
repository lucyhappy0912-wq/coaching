import "server-only";

import { cache } from "react";

import { requireAdmin } from "@/lib/auth/dal";
import { dataStoreMode } from "@/lib/check/store-mode";

import {
  createLeadJsonl,
  getLeadJsonl,
  listLeadsJsonl,
  removeLeadJsonl,
  setLeadStatusJsonl,
} from "./store-jsonl";
import {
  createLeadSupabase,
  getLeadSupabase,
  listLeadsSupabase,
  markAllNewLeadsContactedSupabase,
  removeLeadSupabase,
  setLeadStatusSupabase,
} from "./store-supabase";
import { revalidateAdminNav } from "@/lib/admin/nav-counts";
import type { Lead, LeadListItem, LeadStatus } from "./types";

export type { Lead, LeadListItem, LeadStatus } from "./types";

function assertWritable() {
  if (dataStoreMode() === "readonly") throw new Error("LEAD_STORE_READONLY");
}

function missingTable(error: unknown) {
  return error instanceof Error && error.message === "STORE_NO_TABLE";
}

export async function createLead(input: {
  name: string;
  phone: string;
  preferredTime: string;
  message: string;
}) {
  assertWritable();
  const id =
    dataStoreMode() === "supabase" ? await createLeadSupabase(input) : await createLeadJsonl(input);
  revalidateAdminNav();
  return id;
}

export const listLeadsForAdmin = cache(async (): Promise<LeadListItem[]> => {
  await requireAdmin();
  const mode = dataStoreMode();
  try {
    if (mode === "readonly") return [];
    if (mode === "supabase") return await listLeadsSupabase();
    return await listLeadsJsonl();
  } catch (error) {
    if (missingTable(error)) return [];
    throw error;
  }
});

export async function getLeadForAdmin(id: string): Promise<Lead | null> {
  await requireAdmin();
  const mode = dataStoreMode();
  try {
    if (mode === "readonly") return null;
    if (mode === "supabase") return await getLeadSupabase(id);
    return await getLeadJsonl(id);
  } catch (error) {
    if (missingTable(error)) return null;
    throw error;
  }
}

export async function setLeadStatus(id: string, status: LeadStatus) {
  await requireAdmin();
  assertWritable();
  const ok =
    dataStoreMode() === "supabase"
      ? await setLeadStatusSupabase(id, status)
      : await setLeadStatusJsonl(id, status);
  if (ok) revalidateAdminNav();
  return ok;
}

/** 목록·상세를 열면 신규 뱃지를 내린다. 전체를 다시 읽지 않는다. */
export async function markNewLeadsSeen(id?: string) {
  await requireAdmin();
  if (dataStoreMode() === "readonly") return;
  if (id) {
    await setLeadStatus(id, "contacted");
    return;
  }
  if (dataStoreMode() === "supabase") {
    await markAllNewLeadsContactedSupabase();
    revalidateAdminNav();
    return;
  }
  const rows = (await listLeadsJsonl()).filter((row) => row.status === "new");
  await Promise.all(rows.map((row) => setLeadStatusJsonl(row.id, "contacted")));
  revalidateAdminNav();
}

export async function removeLead(id: string) {
  await requireAdmin();
  assertWritable();
  const ok =
    dataStoreMode() === "supabase" ? await removeLeadSupabase(id) : await removeLeadJsonl(id);
  if (ok) revalidateAdminNav();
  return ok;
}
