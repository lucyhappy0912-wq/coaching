"use client";

import { useActionState, useState } from "react";

import { submitCheck, type CheckFormState } from "@/app/(site)/check/actions";
import { isLikert } from "@/lib/check/compute";
import {
  AREA_IDS,
  AREAS,
  LIKERT_LABELS,
  QUESTIONS,
  type Likert,
  type QuestionKey,
} from "@/lib/check/questions";
import { cn } from "@/lib/utils";

const initial: CheckFormState = { error: null };

const inputClass =
  "b2 min-h-12 w-full rounded-none border-0 border-b border-ink-50 bg-transparent py-3 text-forest outline-none transition-colors placeholder:text-ink-70 focus:border-forest";

const EMAIL_DOMAINS = [
  "naver.com",
  "gmail.com",
  "daum.net",
  "hanmail.net",
  "nate.com",
  "kakao.com",
  "hotmail.com",
  "icloud.com",
] as const;

const CUSTOM_DOMAIN = "custom";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function CheckForm({ source }: { source: string }) {
  const [state, action, pending] = useActionState(submitCheck, initial);
  const [started, setStarted] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [identity, setIdentity] = useState({
    name: "",
    phone: "",
    email: "",
    agree: false,
    contactConsent: false,
  });
  const [areaIndex, setAreaIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, Likert>>>({});
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState<
    (typeof EMAIL_DOMAINS)[number] | typeof CUSTOM_DOMAIN
  >(CUSTOM_DOMAIN);

  function setEmail(next: string) {
    setIdentity((prev) => ({ ...prev, email: next.trim() }));
  }

  function onDomainChange(next: typeof emailDomain) {
    setEmailDomain(next);
    if (next === CUSTOM_DOMAIN) {
      const current = identity.email.includes("@")
        ? identity.email
        : emailLocal
          ? `${emailLocal}@`
          : "";
      setEmail(current);
      return;
    }
    const local = (identity.email.split("@")[0] || emailLocal).replace(/@/g, "");
    setEmailLocal(local);
    setEmail(local ? `${local}@${next}` : "");
  }

  function startSurvey() {
    const name = identity.name.trim();
    const phone = identity.phone.replace(/\D/g, "");
    const email = identity.email.trim();

    if (name.length < 2) return setGateError("이름을 정확히 입력해 주세요.");
    if (phone.length < 10) return setGateError("연락처를 정확히 입력해 주세요.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setGateError("이메일 주소를 정확히 입력해 주세요.");
    }
    if (!identity.agree) return setGateError("개인정보 수집·이용에 동의해 주세요.");

    setGateError(null);
    setAreaIndex(0);
    setStarted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const areaId = AREA_IDS[areaIndex];
  const areaMeta = AREAS[areaId];
  const areaQuestions = QUESTIONS.filter((q) => q.area === areaId);
  const areaDone = areaQuestions.every((q) => answers[q.key]);
  const isLastArea = areaIndex === AREA_IDS.length - 1;

  function goNext() {
    if (!areaDone) {
      setSectionError("이 영역의 문항에 모두 답해 주세요.");
      return;
    }
    setSectionError(null);
    setAreaIndex((i) => Math.min(i + 1, AREA_IDS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goPrev() {
    setSectionError(null);
    setAreaIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!started) {
    return (
      <>
        <header>
          <p className="c1 tracking-[0.16em] text-forest-70 uppercase">멈춘자 · Transition Partner</p>
          <h1 className="serif mt-3 text-[28px] leading-tight sm:text-[40px]">
            Founder Transition Check
          </h1>
          <p className="b2 mt-4 text-ink-70">
            회사의 다음 단계에 앞서 Founder 자신을 점검하는 약 5분입니다. 최근 3~6개월의 실제 모습을
            떠올리며 답해 주세요. 점수가 높을수록 부족한 것이 아니라, 전환 신호가 많다는 뜻입니다.
          </p>
          <p className="b3 mt-3 text-ink-70">
            의학적·심리학적 진단이 아닙니다. 상담을 신청하지 않아도 분석지는 그대로 안내드립니다.
          </p>
        </header>
      <section className="mt-8 border border-forest-20 bg-white px-5 py-6 sm:mt-12 sm:p-7 lg:p-10">
        <p className="c1 tracking-[0.16em] text-forest-70 uppercase">Before you start</p>
        <h2 className="serif mt-2 text-[22px] leading-snug lg:text-[28px]">시작하기 전에 남겨 주세요</h2>
        <p className="b3 mt-3 text-ink-70">
          이름, 전화, 이메일과 동의 후에 문항이 열립니다. 결과는 제출 직후 바로 보여 드립니다.
        </p>
        <div className="mt-8 grid gap-6">
          <label className="block">
            <span className="c1 mb-2 block tracking-[0.12em] text-forest-70 uppercase">이름</span>
            <input
              value={identity.name}
              onChange={(e) => setIdentity((prev) => ({ ...prev, name: e.target.value }))}
              autoComplete="name"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="c1 mb-2 block tracking-[0.12em] text-forest-70 uppercase">전화번호</span>
            <input
              value={identity.phone}
              onChange={(e) => setIdentity((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="010-1234-5678"
              className={inputClass}
            />
          </label>
          <div>
            <span className="c1 mb-2 block tracking-[0.12em] text-forest-70 uppercase">이메일</span>
            {emailDomain === CUSTOM_DOMAIN ? (
              <input
                value={identity.email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                className={inputClass}
              />
            ) : (
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                <input
                  value={emailLocal}
                  onChange={(e) => {
                    const local = e.target.value.replace(/@/g, "");
                    setEmailLocal(local);
                    setEmail(local ? `${local}@${emailDomain}` : "");
                  }}
                  autoComplete="username"
                  inputMode="email"
                  placeholder="아이디"
                  className={inputClass}
                />
                <span className="pb-3 text-forest-70">@</span>
                <input
                  value={emailDomain}
                  readOnly
                  tabIndex={-1}
                  className={cn(inputClass, "text-ink-70")}
                />
              </div>
            )}
            <div className="relative mt-3">
              <select
                value={emailDomain}
                onChange={(e) => onDomainChange(e.target.value as typeof emailDomain)}
                className={cn(inputClass, "appearance-none pr-8")}
                aria-label="이메일 도메인 선택"
              >
                <option value={CUSTOM_DOMAIN}>직접 입력</option>
                {EMAIL_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-forest-70">
                ▾
              </span>
            </div>
          </div>
        </div>
        <label className="b3 mt-8 flex items-start gap-3 rounded-sm bg-grass-10 px-3 py-3 text-ink-70">
          <input
            type="checkbox"
            checked={identity.agree}
            onChange={(e) => setIdentity((prev) => ({ ...prev, agree: e.target.checked }))}
            className="mt-0.5 size-5 shrink-0 rounded-none border-ink-50 accent-forest"
          />
          <span>
            결과 제공과 제출 기록 확인을 위해 이름·전화번호·이메일·21문항 응답을 수집·이용합니다.
            의학적·심리학적 진단이 아닙니다. 제출일로부터 90일 이내 파기합니다. 만 14세 미만은 이용할
            수 없습니다.{" "}
            <a href="/privacy" className="lined text-forest">
              개인정보처리방침
            </a>
          </span>
        </label>
        <label className="b3 mt-3 flex items-start gap-3 px-3 py-3 text-ink-70">
          <input
            type="checkbox"
            checked={identity.contactConsent}
            onChange={(e) => setIdentity((prev) => ({ ...prev, contactConsent: e.target.checked }))}
            className="mt-0.5 size-5 shrink-0 rounded-none border-ink-50 accent-forest"
          />
          <span>프로그램 관련 연락을 받는 데 동의합니다. 거부해도 결과는 볼 수 있습니다.</span>
        </label>
        {gateError && <p className="b3 mt-5 text-[#c0392b]">{gateError}</p>}
        <button
          type="button"
          onClick={startSurvey}
          className="serif mt-6 min-h-12 w-full rounded-sm bg-forest text-base text-white shadow-[0_4px_4px_0_rgba(0,58,64,0.1)] transition-colors hover:bg-forest-90"
        >
          동의하고 문답 시작하기
        </button>
      </section>
      </>
    );
  }

  return (
    <form action={action} className="space-y-10 sm:space-y-14">
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="name" value={identity.name} />
      <input type="hidden" name="phone" value={identity.phone} />
      <input type="hidden" name="email" value={identity.email} />
      <input type="hidden" name="agree" value="on" />
      {identity.contactConsent && <input type="hidden" name="contactConsent" value="on" />}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      {QUESTIONS.map((q) =>
        answers[q.key] ? (
          <input key={q.key} type="hidden" name={q.key} value={answers[q.key]} />
        ) : null,
      )}

      <ol className="flex flex-wrap gap-x-1 gap-y-2">
        {AREA_IDS.map((id, i) => (
          <li key={id} className="flex items-center gap-1">
            <span
              className={cn(
                "c1 tracking-[0.08em]",
                i === areaIndex ? "text-forest" : i < areaIndex ? "text-forest-70" : "text-ink-50",
              )}
            >
              {id}
            </span>
            {i < AREA_IDS.length - 1 && <span className="c1 text-ink-30">›</span>}
          </li>
        ))}
      </ol>

      <section>
        <p className="c1 tracking-[0.16em] text-forest-70 uppercase">
          {areaIndex + 1} / {AREA_IDS.length} · {areaMeta.title}
        </p>
        <h2 className="serif mt-2 text-[22px] leading-snug lg:text-[28px]">{areaMeta.question}</h2>
        <p className="b3 mt-3 text-ink-70">{areaMeta.wrap}</p>
      </section>

      {areaQuestions.map((q) => (
        <fieldset key={q.key}>
          <legend className="b2 text-ink-90">
            <span className="c1 mr-2 text-forest-70">{String(q.no).padStart(2, "0")}</span>
            {q.prompt}
          </legend>
          <div className="mt-4 flex flex-col gap-2">
            {LIKERT_LABELS.map((opt) => (
              <label
                key={opt.value}
                className="flex min-h-12 cursor-pointer items-center gap-3 border border-ink-15 bg-white px-3 py-3 transition-colors has-[:checked]:border-forest has-[:checked]:bg-grass-10"
              >
                <input
                  type="radio"
                  name={`view-${q.key}`}
                  value={opt.value}
                  checked={answers[q.key] === opt.value}
                  onChange={() => {
                    if (!isLikert(opt.value)) return;
                    setAnswers((prev) => ({ ...prev, [q.key]: opt.value }));
                    setSectionError(null);
                  }}
                  className="size-4 shrink-0 accent-forest"
                />
                <span className="serif w-5 shrink-0 text-lg text-forest">{opt.value}</span>
                <span className="b3 text-ink-90">{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {(sectionError || state.error) && (
        <p className="b3 text-[#c0392b]">{sectionError || state.error}</p>
      )}

      <div className="sticky bottom-0 -mx-5 flex gap-2 border-t border-forest-20 bg-grass-10/95 px-5 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        {areaIndex > 0 && (
          <button
            type="button"
            onClick={goPrev}
            className="serif min-h-12 flex-1 rounded-sm border border-forest bg-white text-forest"
          >
            이전
          </button>
        )}
        {isLastArea ? (
          <button
            type="submit"
            disabled={pending || !areaDone}
            className="serif min-h-12 flex-[2] rounded-sm bg-forest text-base text-white shadow-[0_4px_4px_0_rgba(0,58,64,0.1)] disabled:opacity-60"
          >
            {pending ? "분석지를 만들고 있습니다..." : "제출하고 분석지 보기"}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="serif min-h-12 flex-[2] rounded-sm bg-forest text-base text-white shadow-[0_4px_4px_0_rgba(0,58,64,0.1)]"
          >
            다음 · {AREA_IDS[areaIndex + 1]}
          </button>
        )}
      </div>
    </form>
  );
}
