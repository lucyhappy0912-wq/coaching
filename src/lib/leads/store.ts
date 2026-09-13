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
  removeLeadSupabase,
  setLeadStatusSupabase,
} from "./store-supabase";
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
  if (dataStoreMode() === "supabase") return createLeadSupabase(input);
  return createLeadJsonl(input);
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
  if (dataStoreMode() === "supabase") return setLeadStatusSupabase(id, status);
  return setLeadStatusJsonl(id, status);
}

export async function removeLead(id: string) {
  await requireAdmin();
  assertWritable();
  if (dataStoreMode() === "supabase") return removeLeadSupabase(id);
  return removeLeadJsonl(id);
}
