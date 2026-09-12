"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import type { CmsCoach, CmsSite, PhotoTone } from "@/lib/cms/types";

import { ImageSlot } from "../_components/ImageSlot";
import { ADM_AREA, ADM_INPUT } from "../_components/fields";
import { ToneSelect } from "../_components/ToneSelect";

import { saveCoach, saveContact, type SaveState } from "./actions";
import { PasswordForm } from "./PasswordForm";

const JUMP = [
  { href: "#contact", label: "연락처" },
  { href: "#coach", label: "코치" },
  { href: "#password", label: "관리자 비밀번호" },
];

function SectionSave({
  pending,
  status,
  disabled,
  onReset,
}: {
  pending: boolean;
  status: string;
  disabled?: boolean;
  onReset: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink-10 pt-4">
      <p className="adm-body text-ink-70">{status}</p>
      <div className="flex gap-2">
        <button type="button" onClick={onReset} className="adm-body h-10 rounded-[4px] px-4 text-forest hover:bg-ink-05">
          되돌리기
        </button>
        <button
          type="submit"
          disabled={pending || disabled}
          className="adm-body h-10 rounded-[4px] bg-forest px-5 font-medium text-white disabled:opacity-45"
        >
          {pending ? "저장 중…" : "이 항목만 저장"}
        </button>
      </div>
    </div>
  );
}

function statusOf(pending: boolean, state: SaveState, idle: string) {
  if (pending) return "저장 중…";
  if (state.error) return state.error;
  if (state.ok) return "저장했습니다.";
  return idle;
}

function useSaved<T>(initial: T, state: SaveState, current: T) {
  const [saved, setSaved] = useState(initial);
  const currentRef = useRef(current);
  currentRef.current = current;
  useEffect(() => {
    if (state.ok && state.stamp) setSaved(currentRef.current);
  }, [state.ok, state.stamp]);
  return saved;
}

export function SiteForms({
  site,
  coach,
  canSave,
  canChangePassword,
}: {
  site: CmsSite;
  coach: CmsCoach;
  canSave: boolean;
  canChangePassword: boolean;
}) {
  return (
    <div className="space-y-8">
      {!canSave ? (
        <p className="adm-body text-danger">이 환경에서는 저장할 수 없습니다.</p>
      ) : null}
      <nav className="flex flex-wrap gap-2">
        {JUMP.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="adm-body rounded-[4px] border border-ink-15 bg-white px-3 py-1.5 text-forest hover:border-forest-30"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <ContactForm initial={site} canSave={canSave} />
      <CoachForm initial={coach} canSave={canSave} />
      <PasswordForm canChange={canChangePassword} />
    </div>
  );
}

function ContactForm({ initial, canSave }: { initial: CmsSite; canSave: boolean }) {
  const [value, setValue] = useState(initial);
  const [state, action, pending] = useActionState(saveContact, { ok: false } satisfies SaveState);
  const saved = useSaved(initial, state, value);
  const field = (key: keyof CmsSite) => ({
    name: `site.${key}`,
    value: value[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue((current) => ({ ...current, [key]: event.target.value })),
  });

  return (
    <form id="contact" action={action} className="scroll-mt-6 rounded-[6px] border border-ink-15 bg-white p-5">
      <h2 className="adm-h text-forest">연락처 · 상호</h2>
      <p className="adm-body mt-1 text-ink-70">푸터와 상담 안내에 그대로 나갑니다.</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">영문 이름</span>
          <input className={ADM_INPUT} {...field("name")} />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">한글 이름</span>
          <input className={ADM_INPUT} {...field("nameKo")} />
        </label>
        <label className="block sm:col-span-2">
          <span className="adm-label mb-1.5 block text-forest-70">한 줄 소개</span>
          <input className={ADM_INPUT} {...field("tagline")} />
        </label>
        <label className="block sm:col-span-2">
          <span className="adm-label mb-1.5 block text-forest-70">설명</span>
          <textarea className={ADM_AREA} {...field("description")} />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">전화</span>
          <input className={ADM_INPUT} {...field("phone")} />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">이메일</span>
          <input className={ADM_INPUT} type="email" {...field("email")} />
        </label>
        <label className="block sm:col-span-2">
          <span className="adm-label mb-1.5 block text-forest-70">주소</span>
          <input className={ADM_INPUT} {...field("addressLine")} />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">평일 운영시간</span>
          <input className={ADM_INPUT} {...field("hours")} />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">토요일 운영시간</span>
          <input className={ADM_INPUT} {...field("lunch")} />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">대표</span>
          <input className={ADM_INPUT} {...field("owner")} />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">상호</span>
          <input className={ADM_INPUT} {...field("company")} />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">사업자번호</span>
          <input className={ADM_INPUT} {...field("bizNo")} />
        </label>
      </div>
      <SectionSave
        pending={pending}
        disabled={!canSave}
        status={statusOf(pending, state, "이 칸만 저장됩니다.")}
        onReset={() => setValue(saved)}
      />
    </form>
  );
}

function CoachForm({ initial, canSave }: { initial: CmsCoach; canSave: boolean }) {
  const [value, setValue] = useState(initial);
  const [state, action, pending] = useActionState(saveCoach, { ok: false } satisfies SaveState);
  const saved = useSaved(initial, state, value);

  return (
    <form id="coach" action={action} className="scroll-mt-6 rounded-[6px] border border-ink-15 bg-white p-5">
      <h2 className="adm-h text-forest">코치</h2>
      <p className="adm-body mt-1 text-ink-70">소개 페이지와 홈 코치 띠에 나갑니다.</p>
      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <ImageSlot
          name="coach.image"
          value={value.image}
          tone={value.tone}
          onChange={(url) => setValue((current) => ({ ...current, image: url }))}
          label="코치 사진을 올려 주세요"
        />
        <div className="space-y-5">
          <label className="block">
            <span className="adm-label mb-1.5 block text-forest-70">이름</span>
            <input
              className={ADM_INPUT}
              name="coach.name"
              value={value.name}
              onChange={(event) => setValue((current) => ({ ...current, name: event.target.value }))}
            />
          </label>
          <label className="block">
            <span className="adm-label mb-1.5 block text-forest-70">역할</span>
            <input
              className={ADM_INPUT}
              name="coach.role"
              value={value.role}
              onChange={(event) => setValue((current) => ({ ...current, role: event.target.value }))}
            />
          </label>
          <ToneSelect
            name="coach.tone"
            value={value.tone}
            onChange={(tone: PhotoTone) => setValue((current) => ({ ...current, tone }))}
          />
        </div>
        <label className="block lg:col-span-2">
          <span className="adm-label mb-1.5 block text-forest-70">소개</span>
          <textarea
            className={ADM_AREA}
            name="coach.intro"
            value={value.intro}
            onChange={(event) => setValue((current) => ({ ...current, intro: event.target.value }))}
          />
        </label>
        <label className="block lg:col-span-2">
          <span className="adm-label mb-1.5 block text-forest-70">이력 (줄마다 한 줄)</span>
          <textarea
            className={ADM_AREA}
            name="coach.credentials"
            value={value.credentials.join("\n")}
            onChange={(event) =>
              setValue((current) => ({
                ...current,
                credentials: event.target.value.split("\n"),
              }))
            }
          />
        </label>
      </div>
      <SectionSave
        pending={pending}
        disabled={!canSave}
        status={statusOf(pending, state, "이 칸만 저장됩니다.")}
        onReset={() => setValue(saved)}
      />
    </form>
  );
}
