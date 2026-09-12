"use client";

import { useActionState } from "react";

import { submitConsult, type ConsultState } from "@/app/(site)/consult-actions";
import { cn } from "@/lib/utils";

export function ConsultForm() {
  const [state, action, pending] = useActionState(submitConsult, { status: "idle" } satisfies ConsultState);

  if (state.status === "done") {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center border border-forest-20 bg-white px-6 text-center">
        <p className="serif t3">Thank you</p>
        <p className="b3 mt-4 text-ink-70">
          상담 신청이 접수되었습니다.
          <br />
          하루 안에 남겨 주신 연락처로 연락드립니다.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="bg-white p-7 lg:p-10">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="이름" htmlFor="name">
          <input id="name" name="name" required autoComplete="name" className={inputClass} />
        </Field>
        <Field label="연락처" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            required
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="010-1234-5678"
            className={inputClass}
          />
        </Field>
        <Field label="상담 희망 시간" htmlFor="preferredTime" className="sm:col-span-2">
          <input
            id="preferredTime"
            name="preferredTime"
            placeholder="평일 저녁 7시 이후"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="고민되는 점" htmlFor="message" className="mt-7">
        <textarea id="message" name="message" rows={3} className={cn(inputClass, "resize-none")} />
      </Field>
      <label className="b3 mt-8 flex items-start gap-3 text-ink-70">
        <input
          type="checkbox"
          name="agree"
          className="mt-1 size-3.5 shrink-0 rounded-none border-ink-50 accent-forest"
        />
        <span>
          상담 진행을 위한 개인정보(이름·연락처) 수집·이용에 동의합니다. 상담 종료 후 6개월 이내
          파기됩니다.
        </span>
      </label>
      {state.status === "error" ? <p className="b3 mt-5 text-[#c0392b]">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="serif mt-8 h-12 w-full rounded-sm bg-forest text-base text-white shadow-[0_4px_4px_0_rgba(0,58,64,0.1)] transition-colors hover:bg-forest-90 disabled:opacity-60"
      >
        {pending ? "신청 중..." : "무료 상담 신청하기"}
      </button>
    </form>
  );
}

const inputClass =
  "b2 w-full rounded-none border-0 border-b border-ink-50 bg-transparent pb-2 text-forest outline-none transition-colors placeholder:text-ink-70 focus:border-forest";

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="c1 mb-3 block tracking-[0.15em] text-forest-70 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
