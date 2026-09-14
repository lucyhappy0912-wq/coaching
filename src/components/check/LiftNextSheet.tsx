"use client";

import { Fragment, useActionState, useState } from "react";

import { applyLift, type LiftApplyState } from "@/app/(site)/check/lift-actions";
import { LinedLink } from "@/components/ui/Buttons";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { LIFT_NEXT } from "@/lib/check/lift-copy";
import { formatMobileInput } from "@/lib/phone";
import { cn } from "@/lib/utils";

export type LiftApplicant = { name: string; phone: string; email: string };

const LIFT_NAME = "LIFT – Life Architecture";

const APPLY_BTN =
  "serif inline-flex h-11 w-full items-center justify-center rounded-sm bg-forest px-7 text-[15px] text-white shadow-[0_4px_4px_0_rgba(0,58,64,0.1)] hover:bg-forest-90 disabled:opacity-60 lg:h-12 lg:px-8 lg:text-base";

const inputClass =
  "b2 w-full rounded-none border-0 border-b border-ink-50 bg-transparent pb-2 text-forest outline-none transition-colors placeholder:text-ink-70 focus:border-forest";

function liftStanza(text: string) {
  const chunks = text.split(LIFT_NAME);
  return chunks.map((chunk, i) => (
    <Fragment key={i}>
      {i > 0 ? <span className="whitespace-nowrap">{LIFT_NAME}</span> : null}
      {chunk}
    </Fragment>
  ));
}

function LiftCopy({
  title,
  stanzas,
}: {
  title: string;
  stanzas: readonly string[];
}) {
  const [intro, questions, ...rest] = stanzas;
  const close = rest.at(-1);
  const middle = rest.slice(0, -1);
  return (
    <>
      <p className="serif t3 mt-3 whitespace-pre-line break-keep">{title}</p>
      {intro ? <p className="b3 mt-5 whitespace-pre-line text-ink-70">{liftStanza(intro)}</p> : null}
      {questions ? (
        <blockquote className="serif mt-8 border-l-[3px] border-stem pl-5 text-[16px] leading-[1.55] whitespace-pre-line break-keep text-forest lg:pl-7 lg:text-[20px] lg:leading-[1.45]">
          {liftStanza(questions)}
        </blockquote>
      ) : null}
      {middle.map((stanza) => (
        <p key={stanza} className="b3 mt-5 whitespace-pre-line text-ink-70">
          {liftStanza(stanza)}
        </p>
      ))}
      {close ? (
        <p className="serif mt-10 border-t border-forest-20 pt-6 text-[18px] leading-snug whitespace-pre-line break-keep text-forest lg:text-[22px]">
          {liftStanza(close)}
        </p>
      ) : null}
    </>
  );
}

function LiftDone() {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center border border-forest-20 bg-white px-6 py-8 text-center">
      <p className="serif t3">신청이 완료되었습니다.</p>
      <p className="b3 mt-3 text-ink-70">남겨 주신 연락처로 안내드리겠습니다.</p>
    </div>
  );
}

function LiftApply({ applicant }: { applicant: LiftApplicant }) {
  const [state, action, pending] = useActionState(applyLift, { status: "idle" } satisfies LiftApplyState);
  if (state.status === "done") return <LiftDone />;
  return (
    <form action={action} className="flex flex-col gap-4">
      <HoneypotField />
      <input type="hidden" name="name" value={applicant.name} />
      <input type="hidden" name="phone" value={applicant.phone} />
      <input type="hidden" name="email" value={applicant.email} />
      <button type="submit" disabled={pending} className={APPLY_BTN}>
        {pending ? "신청 중…" : LIFT_NEXT.cta}
      </button>
      {state.status === "error" ? <p className="b3 text-[#c0392b]">{state.message}</p> : null}
    </form>
  );
}

function LiftPublicApply() {
  const [state, action, pending] = useActionState(applyLift, { status: "idle" } satisfies LiftApplyState);
  const [phone, setPhone] = useState("");
  if (state.status === "done") return <LiftDone />;
  return (
    <form action={action} className="flex flex-col gap-7 border border-forest-20 bg-white px-5 py-6 sm:p-7">
      <HoneypotField />
      <input type="hidden" name="public" value="1" />
      <div>
        <label htmlFor="lift-name" className="c1 mb-3 block tracking-[0.15em] text-forest-70 uppercase">
          이름
        </label>
        <input id="lift-name" name="name" required autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="lift-phone" className="c1 mb-3 block tracking-[0.15em] text-forest-70 uppercase">
          연락처
        </label>
        <input
          id="lift-phone"
          name="phone"
          required
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="010-1234-5678"
          value={phone}
          onChange={(event) => setPhone(formatMobileInput(event.target.value))}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="lift-email" className="c1 mb-3 block tracking-[0.15em] text-forest-70 uppercase">
          이메일
        </label>
        <input
          id="lift-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className={inputClass}
        />
      </div>
      <label className="b3 flex items-start gap-3 text-ink-70">
        <input
          type="checkbox"
          name="agree"
          required
          className="mt-1 size-3.5 shrink-0 rounded-none border-ink-50 accent-forest"
        />
        <span>
          신청 안내를 위한 개인정보(이름·연락처) 수집·이용에 동의합니다. 상담 종료 후 6개월 이내
          파기됩니다.
        </span>
      </label>
      <button type="submit" disabled={pending} className={cn(APPLY_BTN, "mt-1")}>
        {pending ? "신청 중…" : LIFT_NEXT.cta}
      </button>
      {state.status === "error" ? <p className="b3 text-[#c0392b]">{state.message}</p> : null}
    </form>
  );
}

export function LiftNextSheet({
  showCta,
  applicant,
  showHomeLink = true,
}: {
  showCta: boolean;
  applicant?: LiftApplicant;
  showHomeLink?: boolean;
}) {
  return (
    <>
      <section className="relative overflow-hidden border border-forest-20 bg-grass-10 px-5 py-6 sm:p-7 lg:p-10">
        <p
          aria-hidden
          className="serif pointer-events-none absolute -right-2 top-2 select-none text-[80px] leading-none text-forest/[0.06] lg:-right-1 lg:top-0 lg:text-[128px]"
        >
          LIFT
        </p>
        <p className="c1 relative tracking-[0.2em] text-forest-70 uppercase">LIFT · Life Architecture</p>
        <div className="relative lg:hidden">
          <LiftCopy title={LIFT_NEXT.titleMobile} stanzas={LIFT_NEXT.stanzasMobile} />
        </div>
        <div className="relative hidden lg:block">
          <LiftCopy title={LIFT_NEXT.title} stanzas={LIFT_NEXT.stanzas} />
        </div>
      </section>
      {showCta ? (
        <section className="mt-16 flex flex-col gap-4">
          {applicant ? <LiftApply applicant={applicant} /> : <LiftPublicApply />}
          {showHomeLink ? (
            <LinedLink href="/" replace className="text-forest">
              홈으로
            </LinedLink>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
