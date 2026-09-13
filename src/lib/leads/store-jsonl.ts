import "server-only";

import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { digitsOnly, isKoreanMobile } from "@/lib/phone";

import type { Lead, LeadListItem, LeadStatus } from "./types";

const FILE = path.join(process.cwd(), "data", "leads.jsonl");
export const LEAD_CONSENT_VERSION = "consult-2026-09";
const DAY = 24 * 60 * 60 * 1000;
export const LEAD_KEEP_MS = 180 * DAY;

let writeChain: Promise<void> = Promise.resolve();

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

async function readAll(): Promise<Lead[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Lead);
  } catch {
    return [];
  }
}

async function replaceAll(rows: Lead[]) {
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
        throw new Error("LEAD_STORE_WRITE_FAILED");
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

async function withWrite<T>(fn: (rows: Lead[]) => Promise<T> | T) {
  let result!: T;
  writeChain = writeChain.then(async () => {
    const now = Date.now();
    const live = (await readAll()).filter((row) => new Date(row.purgeAt).getTime() > now);
    result = await fn(live);
  });
  await writeChain;
  return result;
}

export function cleanLeadName(value: string) {
  return value.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 40);
}

export function validateLead(input: { name: string; phone: string; preferredTime: string; message: string }) {
  const name = cleanLeadName(input.name);
  const phone = digitsOnly(input.phone);
  const preferredTime = input.preferredTime.trim().slice(0, 60);
  const message = input.message.trim().slice(0, 1000);
  if (name.length < 2 || name.length > 40) throw new Error("LEAD_INVALID");
  if (!isKoreanMobile(phone)) throw new Error("LEAD_PHONE");
  return { name, phone, preferredTime, message };
}

export async function createLeadJsonl(input: {
  name: string;
  phone: string;
  preferredTime: string;
  message: string;
}) {
  const { name, phone, preferredTime, message } = validateLead(input);
  const receivedAt = new Date();
  const row: Lead = {
    id: randomUUID(),
    name,
    phone,
    preferredTime,
    message,
    status: "new",
    receivedAt: receivedAt.toISOString(),
    closedAt: "",
    purgeAt: new Date(receivedAt.getTime() + LEAD_KEEP_MS).toISOString(),
    consentVersion: LEAD_CONSENT_VERSION,
  };
  await withWrite(async (rows) => {
    rows.unshift(row);
    await replaceAll(rows);
  });
  return row.id;
}

export async function listLeadsJsonl(): Promise<LeadListItem[]> {
  return withWrite(async (rows) => {
    await replaceAll(rows);
    return rows.map(toList);
  });
}

export async function getLeadJsonl(id: string): Promise<Lead | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return withWrite(async (rows) => {
    await replaceAll(rows);
    return rows.find((row) => row.id === id) ?? null;
  });
}

export async function setLeadStatusJsonl(id: string, status: LeadStatus) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  return withWrite(async (rows) => {
    const next = rows.map((row) => {
      if (row.id !== id) return row;
      const closedAt = status === "closed" ? new Date().toISOString() : "";
      const base = new Date(closedAt || row.receivedAt).getTime();
      return {
        ...row,
        status,
        closedAt,
        purgeAt: new Date(base + LEAD_KEEP_MS).toISOString(),
      };
    });
    await replaceAll(next);
    return true;
  });
}

export async function removeLeadJsonl(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  return withWrite(async (rows) => {
    const next = rows.filter((row) => row.id !== id);
    await replaceAll(next);
    return next.length !== rows.length;
  });
}
