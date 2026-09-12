"use client";

import { useActionState } from "react";

import { updateCheck } from "@/app/admin/checks/actions";
import type { UpdateCheckState } from "@/app/admin/checks/search";
import type { Answers } from "@/lib/check/compute";
import { formatPhoneDisplay } from "@/lib/check/mask";
import { AREA_IDS, AREAS, LIKERT_LABELS, QUESTIONS } from "@/lib/check/questions";

const initial: UpdateCheckState = { error: null };

const inputClass =
  "adm-input h-10 w-full rounded-[4px] border border-ink-50 bg-white px-3 text-forest";

export function AdminCheckEditForm({
  id,
  name,
  phone,
  email,
  industry,
  founderJourney,
  contactConsent,
  answers,
}: {
  id: string;
  name: string;
  phone: string;
  email: string;
  industry: string;
  founderJourney: string;
  contactConsent: boolean;
  answers: Answers;
}) {
  const [state, action, pending] = useActionState(updateCheck, initial);

  return (
    <form action={action} className="mt-6 space-y-6">
      <input type="hidden" name="id" value={id} />

      <section className="rounded-[6px] border border-ink-15 bg-white p-5">
        <h2 className="adm-h text-forest">응답자</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="adm-label mb-1.5 block text-forest-70">이름</span>
            <input name="name" defaultValue={name} required maxLength={80} className={inputClass} />
          </label>
          <label className="block">
            <span className="adm-label mb-1.5 block text-forest-70">전화</span>
            <input
              name="phone"
              type="tel"
              defaultValue={formatPhoneDisplay(phone)}
              required
              className={inputClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="adm-label mb-1.5 block text-forest-70">이메일</span>
            <input
              name="email"
              type="email"
              defaultValue={email}
              required
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="adm-label mb-1.5 block text-forest-70">Industry (업종)</span>
            <input
              name="industry"
              defaultValue={industry}
              required
              maxLength={80}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="adm-label mb-1.5 block text-forest-70">Founder Journey</span>
            <input
              name="founderJourney"
              defaultValue={founderJourney}
              required
              maxLength={80}
              className={inputClass}
            />
          </label>
        </div>
        {contactConsent ? (
          <label className="adm-body mt-4 flex items-start gap-3 text-ink-70">
            <input
              type="checkbox"
              name="contactConsent"
              defaultChecked
              className="mt-0.5 size-4 accent-forest"
            />
            프로그램 관련 연락 동의. 해제하면 거부로 바뀝니다. 거부를 동의로 올릴 수는 없습니다.
          </label>
        ) : (
          <p className="adm-body mt-4 text-ink-70">프로그램 연락: 거부. 관리자가 동의로 바꿀 수 없습니다.</p>
        )}
      </section>

      {AREA_IDS.map((areaId) => {
        const questions = QUESTIONS.filter((q) => q.area === areaId);
        return (
          <section key={areaId} className="rounded-[6px] border border-ink-15 bg-white p-5">
            <h2 className="adm-h text-forest">{AREAS[areaId].title}</h2>
            <p className="adm-body mt-1 text-ink-70">{AREAS[areaId].question}</p>
            <ol className="mt-4 space-y-6">
              {questions.map((q) => (
                <li key={q.key}>
                  <p className="adm-label text-forest-70">
                    {String(q.no).padStart(2, "0")} · {q.label}
                  </p>
                  <p className="adm-body mt-2 text-ink-90">{q.prompt}</p>
                  <div className="mt-3 grid gap-2">
                    {LIKERT_LABELS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex min-h-10 cursor-pointer items-center gap-3 rounded-[4px] border border-ink-10 bg-ink-05 px-3 py-2 has-[:checked]:border-forest has-[:checked]:bg-white"
                      >
                        <input
                          type="radio"
                          name={q.key}
                          value={opt.value}
                          defaultChecked={answers[q.key] === opt.value}
                          required
                          className="size-4 accent-forest"
                        />
                        <span className="adm-body text-ink-90">
                          {opt.value}점 · {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      {state.error ? <p className="adm-body text-danger">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="adm-body h-10 rounded-[4px] bg-forest px-5 font-medium text-white disabled:opacity-45"
      >
        {pending ? "저장 중…" : "수정 저장"}
      </button>
    </form>
  );
}
