"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/dal";
import { isLikert, type Answers } from "@/lib/check/compute";
import { QUESTION_KEYS, type QuestionKey } from "@/lib/check/questions";
import { getCheckForAdmin, removeCheckForAdmin, updateCheckForAdmin } from "@/lib/check/store";
import { CHECK_NAME_SEARCH_COOKIE, NAME_QUERY_MAX, type UpdateCheckState } from "./search";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function searchCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/admin/checks",
    maxAge: 60 * 30,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function searchChecks(formData: FormData) {
  await requireAdmin();
  const q = String(formData.get("q") ?? "").trim().slice(0, NAME_QUERY_MAX);
  const jar = await cookies();
  if (!q) jar.delete({ name: CHECK_NAME_SEARCH_COOKIE, path: "/admin/checks" });
  else jar.set({ name: CHECK_NAME_SEARCH_COOKIE, value: q, ...searchCookieOptions() });
  redirect("/admin/checks");
}

export async function clearCheckSearch() {
  await requireAdmin();
  (await cookies()).delete({ name: CHECK_NAME_SEARCH_COOKIE, path: "/admin/checks" });
  redirect("/admin/checks");
}

export async function updateCheck(
  _prev: UpdateCheckState,
  formData: FormData,
): Promise<UpdateCheckState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const found = await getCheckForAdmin(id);
  if (!found) return { error: "제출을 찾지 못했습니다." };

  const name = String(formData.get("name") ?? "").trim().slice(0, NAME_QUERY_MAX);
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "").slice(0, 11);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const industry = String(formData.get("industry") ?? "").trim().slice(0, 80);
  const founderJourney = String(formData.get("founderJourney") ?? "").trim().slice(0, 80);
  const contactConsent = found.record.identity.contactConsent && formData.get("contactConsent") === "on";

  if (name.length < 2) return { error: "이름을 정확히 입력해 주세요." };
  if (phone.length < 10) return { error: "연락처를 정확히 입력해 주세요." };
  if (!EMAIL.test(email)) return { error: "이메일 주소를 정확히 입력해 주세요." };
  if (industry.length < 1) return { error: "업종을 입력해 주세요." };
  if (founderJourney.length < 1) return { error: "창업 후 기간을 입력해 주세요." };

  const answers = {} as Answers;
  for (const key of QUESTION_KEYS) {
    const raw = Number(formData.get(key));
    if (!isLikert(raw)) return { error: "모든 문항에 답해 주세요." };
    answers[key as QuestionKey] = raw;
  }

  try {
    const ok = await updateCheckForAdmin(id, {
      answers,
      name,
      phone,
      email,
      industry,
      founderJourney,
      contactConsent,
    });
    if (!ok) return { error: "제출을 저장하지 못했습니다." };
  } catch {
    return { error: "제출을 저장하지 못했습니다." };
  }

  redirect(`/admin/checks/${id}`);
}

export async function deleteCheck(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const confirm = String(formData.get("confirm") ?? "").trim();
  if (confirm !== "삭제") return;
  await removeCheckForAdmin(id);
  redirect("/admin/checks");
}
