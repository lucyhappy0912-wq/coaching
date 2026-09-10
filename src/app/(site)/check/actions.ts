"use server";

import { redirect } from "next/navigation";

import { isLikert, type Answers } from "@/lib/check/compute";
import { QUESTION_KEYS, type QuestionKey } from "@/lib/check/questions";
import { saveCheck } from "@/lib/check/store";

export type CheckFormState = { error: string | null };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitCheck(
  _prev: CheckFormState,
  formData: FormData,
): Promise<CheckFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const agree = formData.get("agree") === "on";
  const contactConsent = formData.get("contactConsent") === "on";
  const source = String(formData.get("source") ?? "direct").slice(0, 40);
  const honey = String(formData.get("website") ?? "");

  if (honey) return { error: null };
  if (name.length < 2) return { error: "이름을 정확히 입력해 주세요." };
  if (phone.length < 10) return { error: "연락처를 정확히 입력해 주세요." };
  if (!EMAIL.test(email)) return { error: "이메일 주소를 정확히 입력해 주세요." };
  if (!agree) return { error: "결과 제공을 위한 개인정보 수집·이용에 동의해 주세요." };

  const answers = {} as Answers;
  for (const key of QUESTION_KEYS) {
    const raw = Number(formData.get(key));
    if (!isLikert(raw)) return { error: "모든 문항에 답해 주세요." };
    answers[key as QuestionKey] = raw;
  }

  let token: string;
  try {
    ({ token } = await saveCheck({ answers, name, phone, email, contactConsent, source }));
  } catch (error) {
    if (error instanceof Error && error.message === "CHECK_STORE_READONLY") {
      return { error: "지금은 로컬에서만 제출을 저장합니다. 배포 저장소는 아직 연결되지 않았습니다." };
    }
    return { error: "제출을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  redirect(`/check/r/${token}`);
}
