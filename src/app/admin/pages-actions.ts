"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { applyPageSlice } from "@/lib/cms/page-keys";
import { cmsWritable } from "@/lib/cms/client";
import { getContent, patchContent } from "@/lib/cms/store";
import { PAGE_KEYS, type PageKey } from "@/lib/cms/types";

export type SaveState = { ok: boolean; error?: string; stamp?: number };

export async function savePageSlice(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  if (!cmsWritable()) {
    return { ok: false, error: "이 환경에서는 저장할 수 없습니다." };
  }
  const slug = String(formData.get("slug") ?? "") as PageKey;
  if (!PAGE_KEYS.includes(slug)) {
    return { ok: false, error: "페이지를 찾을 수 없습니다." };
  }
  let slice: unknown;
  try {
    slice = sanitizeSlice(JSON.parse(String(formData.get("payload") ?? "")));
  } catch {
    return { ok: false, error: "저장 형식이 올바르지 않습니다." };
  }
  try {
    const current = await getContent();
    await patchContent({ pages: applyPageSlice(current.pages, slug, slice) });
  } catch {
    return { ok: false, error: "저장하지 못했습니다. 저장소 연결을 확인하세요." };
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slug}`);
  return { ok: true, stamp: Date.now() };
}

function safeMedia(value: unknown) {
  if (typeof value !== "string") return "";
  const next = value.trim();
  if (!next) return "";
  if (next.startsWith("/media/") || next.startsWith("/uploads/")) return next;
  if (/^https:\/\//i.test(next)) return next;
  return "";
}

function sanitizeSlice(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeSlice);
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  const next: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(record)) {
    if (key === "image" || key === "video") next[key] = safeMedia(item);
    else next[key] = sanitizeSlice(item);
  }
  return next;
}
