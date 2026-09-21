"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isLikert, type PauseAnswers } from "@/lib/pause/compute";
import { PAUSE_QUESTION_KEYS, type PauseQuestionKey } from "@/lib/pause/questions";
import { getPauseScoresByIdentity, savePauseCheck } from "@/lib/pause/store";
import { honeypotFilled } from "@/lib/honeypot";

import type { FindPauseState } from "./find-state";

export type PauseFormState = { error: string | null };

const FIND_WAIT_MS = 700;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitPause(
  _prev: PauseFormState,
  formData: FormData,
): Promise<PauseFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const agree = formData.get("agree") === "on";
  const contactConsent = formData.get("contactConsent") === "on";
  const source = String(formData.get("source") ?? "direct").slice(0, 40);

  if (honeypotFilled(formData)) return { error: null };
  if (name.length < 2) return { error: "이름을 정확히 입력해 주세요." };
  if (phone.length < 10) return { error: "연락처를 정확히 입력해 주세요." };
  if (!EMAIL.test(email)) return { error: "이메일 주소를 정확히 입력해 주세요." };
  if (!agree) return { error: "결과 제공을 위한 개인정보 수집·이용에 동의해 주세요." };

  const answers = {} as PauseAnswers;
  for (const key of PAUSE_QUESTION_KEYS) {
    const raw = Number(formData.get(key));
    if (!isLikert(raw)) return { error: "모든 문항에 답해 주세요." };
    answers[key as PauseQuestionKey] = raw;
  }

  let token: string;
  try {
    ({ token } = await savePauseCheck({
      answers,
      name,
      phone,
      email,
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
    if (code.startsWith("CHECK_STORE_MISSING_COLUMN")) {
      return { error: "저장 표에 필요한 칸이 없습니다. Supabase SQL Editor에서 check_responses 마이그레이션을 실행해 주세요." };
    }
    if (code.startsWith("CHECK_STORE_WRITE_FAILED")) {
      const hint = code.split(":")[1];
      return {
        error: hint
          ? `저장소가 제출을 거절했습니다 (${hint}).`
          : "저장소에 제출을 넣지 못했습니다. 잠시 후 다시 시도해 주세요.",
      };
    }
    return { error: "제출을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath("/admin/checks");
  redirect(`/pause/r/${token}`, "replace");
}

export async function findPauseReport(
  _prev: FindPauseState,
  formData: FormData,
): Promise<FindPauseState> {
  const started = Date.now();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const miss = {
    error: "입력하신 정보로 분석지를 찾지 못했습니다. 제출 때 넣은 내용을 확인해 주세요.",
    scores: null,
  };

  async function done(state: FindPauseState) {
    const wait = FIND_WAIT_MS - (Date.now() - started);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    return state;
  }

  if (honeypotFilled(formData)) return done({ error: null, scores: null });
  if (name.length < 2) return done({ error: "이름을 정확히 입력해 주세요.", scores: null });
  if (phone.length < 10) return done({ error: "연락처를 정확히 입력해 주세요.", scores: null });
  if (!EMAIL.test(email)) return done({ error: "이메일 주소를 정확히 입력해 주세요.", scores: null });

  try {
    const scores = await getPauseScoresByIdentity(name, phone, email);
    if (!scores) return done(miss);
    return done({ error: null, scores, name, phone, email });
  } catch {
    return done(miss);
  }
}
