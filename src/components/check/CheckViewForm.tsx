"use client";

import { useActionState } from "react";

import { findCheckReport } from "@/app/(site)/check/actions";
import type { FindCheckState } from "@/app/(site)/check/find-state";
import { CheckReport } from "@/components/check/CheckReport";
import { HoneypotField } from "@/components/ui/HoneypotField";

const initial: FindCheckState = { error: null, scores: null };

const inputClass =
  "b2 min-h-12 w-full rounded-none border-0 border-b border-ink-50 bg-transparent py-3 text-forest outline-none transition-colors placeholder:text-ink-70 focus:border-forest";

export function CheckViewForm() {
  const [state, action, pending] = useActionState(findCheckReport, initial);

  return (
    <>
      <form action={action} className="mt-8 border border-forest-20 bg-white px-5 py-6 sm:mt-12 sm:p-7 lg:p-10">
        <p className="c1 tracking-[0.16em] text-forest-70 uppercase">Find your report</p>
        <p className="b3 mt-3 text-ink-70">
          문답 제출 때 넣은 이름·전화번호·이메일을 그대로 입력해 주세요. 가장 최근 제출 한 건의
          분석지만 보여 드립니다.
        </p>
        <HoneypotField />
        <div className="mt-8 grid gap-6">
          <label className="block">
            <span className="c1 mb-2 block tracking-[0.12em] text-forest-70 uppercase">이름</span>
            <input name="name" autoComplete="name" required className={inputClass} />
          </label>
          <label className="block">
            <span className="c1 mb-2 block tracking-[0.12em] text-forest-70 uppercase">전화번호</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              placeholder="010-1234-5678"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="c1 mb-2 block tracking-[0.12em] text-forest-70 uppercase">이메일</span>
            <input
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              className={inputClass}
            />
          </label>
        </div>
        {state.error ? <p className="b3 mt-5 text-[#c0392b]">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="serif mt-6 min-h-12 w-full rounded-sm bg-forest text-base text-white shadow-[0_4px_4px_0_rgba(0,58,64,0.1)] disabled:opacity-60"
        >
          {pending ? "찾는 중…" : "분석지 보기"}
        </button>
      </form>

      {state.scores ? (
        <div className="mt-12">
          <CheckReport scores={state.scores} />
        </div>
      ) : null}
    </>
  );
}
