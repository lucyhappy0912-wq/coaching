"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { saveContent } from "@/lib/cms/store";
import type { CmsData, HeroSlide, PhotoTone } from "@/lib/cms/types";

const TONES: PhotoTone[] = ["sage", "paper", "mist", "dusk", "forest"];

function toneOf(value: string, fallback: PhotoTone): PhotoTone {
  return TONES.includes(value as PhotoTone) ? (value as PhotoTone) : fallback;
}

export async function saveSiteContent(formData: FormData) {
  await requireAdmin();
  const hero: HeroSlide[] = [0, 1].map((index) => ({
    eyebrow: String(formData.get(`hero.${index}.eyebrow`) ?? ""),
    title: String(formData.get(`hero.${index}.title`) ?? ""),
    body: String(formData.get(`hero.${index}.body`) ?? ""),
    cta: {
      label: String(formData.get(`hero.${index}.ctaLabel`) ?? ""),
      href: String(formData.get(`hero.${index}.ctaHref`) ?? "/consult"),
    },
    tone: toneOf(String(formData.get(`hero.${index}.tone`) ?? ""), "forest"),
    image: String(formData.get(`hero.${index}.image`) ?? "").trim(),
    video: String(formData.get(`hero.${index}.video`) ?? "").trim(),
  }));

  const faqs = [0, 1, 2, 3, 4, 5]
    .map((index) => ({
      q: String(formData.get(`faq.${index}.q`) ?? "").trim(),
      a: String(formData.get(`faq.${index}.a`) ?? "").trim(),
    }))
    .filter((item) => item.q && item.a);

  const data: CmsData = {
    site: {
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
    },
    topMessages: [
      String(formData.get("top.0") ?? "").trim(),
      String(formData.get("top.1") ?? "").trim(),
    ].filter(Boolean),
    hero,
    coach: {
      name: String(formData.get("coach.name") ?? ""),
      role: String(formData.get("coach.role") ?? ""),
      intro: String(formData.get("coach.intro") ?? ""),
      credentials: String(formData.get("coach.credentials") ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      tone: toneOf(String(formData.get("coach.tone") ?? ""), "paper"),
      image: String(formData.get("coach.image") ?? "").trim(),
    },
    faqs,
  };

  await saveContent(data);
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/coach");
  revalidatePath("/admin/content");
}
