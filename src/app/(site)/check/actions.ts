"use server";

import { redirect } from "next/navigation";

import { isLikert, type Answers } from "@/lib/check/compute";
import { QUESTION_KEYS, type QuestionKey } from "@/lib/check/questions";
import { getScoresByIdentity, saveCheck } from "@/lib/check/store";

import type { FindCheckState } from "./find-state";

export type CheckFormState = { error: string | null };

const FIND_WAIT_MS = 700;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitCheck(
  _prev: CheckFormState,
  formData: FormData,
): Promise<CheckFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const industry = String(formData.get("industry") ?? "").trim().slice(0, 80);
  const founderJourney = String(formData.get("founderJourney") ?? "").trim().slice(0, 80);
  const agree = formData.get("agree") === "on";
  const contactConsent = formData.get("contactConsent") === "on";
  const source = String(formData.get("source") ?? "direct").slice(0, 40);
  const honey = String(formData.get("website") ?? "");

  if (honey) return { error: null };
  if (name.length < 2) return { error: "이름을 정확히 입력해 주세요." };
  if (phone.length < 10) return { error: "연락처를 정확히 입력해 주세요." };
  if (!EMAIL.test(email)) return { error: "이메일 주소를 정확히 입력해 주세요." };
  if (industry.length < 1) return { error: "업종을 입력해 주세요." };
  if (founderJourney.length < 1) return { error: "창업 후 기간을 입력해 주세요." };
  if (!agree) return { error: "결과 제공을 위한 개인정보 수집·이용에 동의해 주세요." };

  const answers = {} as Answers;
  for (const key of QUESTION_KEYS) {
    const raw = Number(formData.get(key));
    if (!isLikert(raw)) return { error: "모든 문항에 답해 주세요." };
    answers[key as QuestionKey] = raw;
  }

  let token: string;
  try {
    ({ token } = await saveCheck({
      answers,
      name,
      phone,
      email,
      industry,
      founderJourney,
      contactConsent,
      source,
    }));
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "CHECK_STORE_READONLY") {
      return { error: "배포에 저장소 주소와 키가 없습니다. Vercel의 SUPABASE_URL과 SUPABASE_SECRET_KEY를 확인해 주세요." };
    }
    if (code === "CHECK_STORE_AUTH") {
      return { error: "저장소 키가 거부되었습니다. Secret keys의 default를 다시 넣어 주세요." };
    }
    if (code === "CHECK_STORE_NO_TABLE") {
      return { error: "저장 표가 없습니다. Supabase SQL Editor에서 check_responses 마이그레이션을 실행해 주세요." };
    }
    return { error: "제출을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  redirect(`/check/r/${token}`);
}

export async function findCheckReport(
  _prev: FindCheckState,
  formData: FormData,
): Promise<FindCheckState> {
  const started = Date.now();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const honey = String(formData.get("website") ?? "");

  const miss = {
    error: "입력하신 정보로 분석지를 찾지 못했습니다. 제출 때 넣은 내용을 확인해 주세요.",
    scores: null,
  };

  async function done(state: FindCheckState) {
    const wait = FIND_WAIT_MS - (Date.now() - started);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    return state;
  }

  if (honey) return done({ error: null, scores: null });
  if (name.length < 2) return done({ error: "이름을 정확히 입력해 주세요.", scores: null });
  if (phone.length < 10) return done({ error: "연락처를 정확히 입력해 주세요.", scores: null });
  if (!EMAIL.test(email)) return done({ error: "이메일 주소를 정확히 입력해 주세요.", scores: null });

  try {
    const scores = await getScoresByIdentity(name, phone, email);
    if (!scores) return done(miss);
    return done({ error: null, scores });
  } catch {
    return done(miss);
  }
}
