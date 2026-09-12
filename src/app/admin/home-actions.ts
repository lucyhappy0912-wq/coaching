"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { patchContent } from "@/lib/cms/store";
import type { HeroSlide, PhotoTone } from "@/lib/cms/types";

const TONES: PhotoTone[] = ["sage", "paper", "mist", "dusk", "forest"];
const HREFS = ["/consult", "/coaching", "/coaching/founder", "/way", "/check", "/board", "/faq", "/coach"];

function toneOf(value: string, fallback: PhotoTone): PhotoTone {
  return TONES.includes(value as PhotoTone) ? (value as PhotoTone) : fallback;
}

export type SaveState = { ok: boolean; error?: string; stamp?: number };

export async function saveHeroSlides(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const count = Math.min(5, Math.max(1, Number(formData.get("count") ?? 1)));
  const hero: HeroSlide[] = [];
  for (let index = 0; index < count; index += 1) {
    const href = String(formData.get(`hero.${index}.ctaHref`) ?? "/consult");
    hero.push({
      eyebrow: String(formData.get(`hero.${index}.eyebrow`) ?? ""),
      title: String(formData.get(`hero.${index}.title`) ?? ""),
      body: String(formData.get(`hero.${index}.body`) ?? ""),
      cta: {
        label: String(formData.get(`hero.${index}.ctaLabel`) ?? ""),
        href: HREFS.includes(href) ? href : "/consult",
      },
      tone: toneOf(String(formData.get(`hero.${index}.tone`) ?? ""), "forest"),
      image: String(formData.get(`hero.${index}.image`) ?? "").trim(),
      video: String(formData.get(`hero.${index}.video`) ?? "").trim(),
    });
  }
  try {
    await patchContent({ hero });
  } catch {
    return { ok: false, error: "저장하지 못했습니다. 저장소 연결을 확인하세요." };
  }
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, stamp: Date.now() };
}
