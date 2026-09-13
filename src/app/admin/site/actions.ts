"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { cmsFailMessage } from "@/lib/cms/client";
import { patchContent } from "@/lib/cms/store";
import type { CmsCoach, CmsFaq, CmsSite, PhotoTone } from "@/lib/cms/types";

const TONES: PhotoTone[] = ["sage", "paper", "mist", "dusk", "forest"];

function toneOf(value: string, fallback: PhotoTone): PhotoTone {
  return TONES.includes(value as PhotoTone) ? (value as PhotoTone) : fallback;
}

export type SaveState = { ok: boolean; error?: string; stamp?: number };

function fail(error?: unknown): SaveState {
  return { ok: false, error: cmsFailMessage(error) };
}

function ok(): SaveState {
  return { ok: true, stamp: Date.now() };
}

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/coach");
  revalidatePath("/consult");
  revalidatePath("/privacy");
  revalidatePath("/check");
  revalidatePath("/coaching");
  revalidatePath("/way");
  revalidatePath("/belief");
  revalidatePath("/story");
  revalidatePath("/admin/site");
  revalidatePath("/admin/faq");
}

export async function saveContact(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const site: CmsSite = {
    name: String(formData.get("site.name") ?? ""),
    nameKo: String(formData.get("site.nameKo") ?? ""),
    tagline: String(formData.get("site.tagline") ?? ""),
    description: String(formData.get("site.description") ?? ""),
    phone: String(formData.get("site.phone") ?? ""),
    email: String(formData.get("site.email") ?? ""),
    addressLine: String(formData.get("site.addressLine") ?? ""),
    hours: String(formData.get("site.hours") ?? ""),
    lunch: String(formData.get("site.lunch") ?? ""),
    owner: String(formData.get("site.owner") ?? ""),
    company: String(formData.get("site.company") ?? ""),
    bizNo: String(formData.get("site.bizNo") ?? ""),
  };
  try {
    await patchContent({ site });
  } catch (error) {
    return fail(error);
  }
  revalidateSite();
  return ok();
}

export async function saveCoach(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const coach: CmsCoach = {
    name: String(formData.get("coach.name") ?? ""),
    role: String(formData.get("coach.role") ?? ""),
    intro: String(formData.get("coach.intro") ?? ""),
    credentials: String(formData.get("coach.credentials") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    tone: toneOf(String(formData.get("coach.tone") ?? ""), "paper"),
    image: String(formData.get("coach.image") ?? "").trim(),
  };
  try {
    await patchContent({ coach });
  } catch (error) {
    return fail(error);
  }
  revalidateSite();
  return ok();
}

export async function saveFaqs(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const faqs: CmsFaq[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    .map((index) => ({
      q: String(formData.get(`faq.${index}.q`) ?? "").trim(),
      a: String(formData.get(`faq.${index}.a`) ?? "").trim(),
    }))
    .filter((item) => item.q && item.a);
  try {
    await patchContent({ faqs });
  } catch (error) {
    return fail(error);
  }
  revalidateSite();
  return ok();
}
