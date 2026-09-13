"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { patchContent } from "@/lib/cms/store";
import { menuToggleItems, sanitizeMenuOff } from "@/lib/menu";

import type { SaveState } from "../site/actions";

function fail(): SaveState {
  return { ok: false, error: "저장하지 못했습니다. 저장소 연결을 확인하세요." };
}

export async function saveMenu(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const off = menuToggleItems()
    .map((item) => item.href)
    .filter((href) => formData.get(`on:${href}`) !== "on");
  try {
    await patchContent({ menuOff: sanitizeMenuOff(off) });
  } catch {
    return fail();
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
  return { ok: true, stamp: Date.now() };
}
