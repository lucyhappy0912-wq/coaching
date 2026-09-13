"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { cmsFailMessage } from "@/lib/cms/client";
import { patchContent } from "@/lib/cms/store";
import { menuToggleItems, sanitizeMenuOff, sanitizeMenuOn } from "@/lib/menu";

import type { SaveState } from "../site/actions";

function fail(error?: unknown): SaveState {
  return { ok: false, error: cmsFailMessage(error) };
}

export async function saveMenu(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const hrefs = menuToggleItems().map((item) => item.href);
  const on = hrefs.filter((href) => formData.get(`on:${href}`) === "on");
  const off = hrefs.filter((href) => !on.includes(href));
  try {
    await patchContent({
      menuOff: sanitizeMenuOff(off, on),
      menuOn: sanitizeMenuOn(on),
    });
  } catch (error) {
    return fail(error);
  }
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/coaching");
  revalidatePath("/admin/menu");
  return { ok: true, stamp: Date.now() };
}
