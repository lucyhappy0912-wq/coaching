import "server-only";

import { randomUUID } from "node:crypto";

import { dataRest } from "@/lib/supabase/rest";

import { LEAD_CONSENT_VERSION, LEAD_KEEP_MS, validateLead } from "./store-jsonl";
import type { Lead, LeadListItem, LeadStatus } from "./types";

type Row = {
  id: string;
  name: string;
  phone: string;
  preferred_time: string;
  message: string;
  status: LeadStatus;
  received_at: string;
  closed_at: string | null;
  purge_at: string;
  consent_version: string;
};

function toLead(row: Row): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    preferredTime: row.preferred_time,
    message: row.message,
    status: row.status,
    receivedAt: row.received_at,
    closedAt: row.closed_at ?? "",
    purgeAt: row.purge_at,
    consentVersion: row.consent_version,
  };
}

function toList(row: Lead): LeadListItem {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    preferredTime: row.preferredTime,
    message: row.message,
    status: row.status,
    receivedAt: row.receivedAt,
  };
}

export async function createLeadSupabase(input: {
  name: string;
  phone: string;
  preferredTime: string;
  message: string;
}) {
  const { name, phone, preferredTime, message } = validateLead(input);
  const receivedAt = new Date();
  const row: Row = {
    id: randomUUID(),
    name,
    phone,
    preferred_time: preferredTime,
    message,
    status: "new",
    received_at: receivedAt.toISOString(),
    closed_at: null,
    purge_at: new Date(receivedAt.getTime() + LEAD_KEEP_MS).toISOString(),
    consent_version: LEAD_CONSENT_VERSION,
  };
  await dataRest<Row[]>("leads", { method: "POST", body: JSON.stringify(row) });
  return row.id;
}

export async function listLeadsSupabase(): Promise<LeadListItem[]> {
  const now = new Date().toISOString();
  const rows = await dataRest<Row[]>(
    `leads?purge_at=gt.${encodeURIComponent(now)}&select=*&order=received_at.desc`,
  );
  return rows.map((row) => toList(toLead(row)));
}

export async function getLeadSupabase(id: string): Promise<Lead | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const now = new Date().toISOString();
  const rows = await dataRest<Row[]>(
    `leads?id=eq.${encodeURIComponent(id)}&purge_at=gt.${encodeURIComponent(now)}&select=*`,
  );
  return rows[0] ? toLead(rows[0]) : null;
}

export async function setLeadStatusSupabase(id: string, status: LeadStatus) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  const found = await getLeadSupabase(id);
  if (!found) return false;
  const closedAt = status === "closed" ? new Date().toISOString() : "";
  const base = new Date(closedAt || found.receivedAt).getTime();
  await dataRest<unknown>(`leads?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      closed_at: closedAt || null,
      purge_at: new Date(base + LEAD_KEEP_MS).toISOString(),
    }),
  });
  return true;
}

export async function removeLeadSupabase(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  const deleted = await dataRest<Pick<Row, "id">[]>(`leads?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return Array.isArray(deleted) && deleted.length > 0;
}
