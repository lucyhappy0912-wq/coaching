"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import type { HeroSlide, PhotoTone } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

import { AnchorSelect } from "./AnchorSelect";
import { ADM_AREA, ADM_INPUT } from "./fields";
import { ImageSlot } from "./ImageSlot";
import { SaveBar } from "./SaveBar";
import { ToneSelect } from "./ToneSelect";
import { saveHeroSlides, type SaveState } from "../home-actions";

const emptySlide = (): HeroSlide => ({
  eyebrow: "",
  title: "",
  body: "",
  cta: { label: "상담 신청", href: "/consult" },
  tone: "forest",
  image: "",
  video: "",
});

function warnClass(len: number, warn: number) {
  return len >= warn ? "text-warn" : "text-ink-70";
}

export function HeroEditor({
  initial,
  canSave,
}: {
  initial: HeroSlide[];
  canSave: boolean;
}) {
  const [saved, setSaved] = useState(initial);
  const [slides, setSlides] = useState(initial);
  const slidesRef = useRef(slides);
  slidesRef.current = slides;
  const [state, action, pending] = useActionState(saveHeroSlides, { ok: false } satisfies SaveState);

  useEffect(() => {
    if (state.ok && state.stamp) setSaved(slidesRef.current);
  }, [state.ok, state.stamp]);

  function update(index: number, patch: Partial<HeroSlide> | { cta: HeroSlide["cta"] }) {
    setSlides((current) => current.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));
  }

  function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= slides.length) return;
    setSlides((current) => {
      const copy = [...current];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  }

  const dirty = JSON.stringify(slides) !== JSON.stringify(saved);
  const status = pending
    ? "저장 중…"
    : state.error
      ? state.error
      : dirty
        ? "저장하지 않은 변경이 있습니다."
        : state.ok
          ? "저장했습니다. 공개 페이지에 바로 반영됩니다."
          : "사진과 글을 한곳에서 고친 뒤 저장하면 홈 화면이 바뀝니다.";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="count" value={slides.length} />
      {!canSave ? (
        <p className="adm-body text-danger">저장소가 없어 저장할 수 없습니다. Supabase SQL을 실행하고 환경변수를 확인하세요.</p>
      ) : null}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <p className="adm-body text-ink-70">홈 맨 위 화면입니다. 사진과 글을 같이 고칩니다. 1~5장.</p>
        <a
          href="/#hero"
          target="admin-preview"
          rel="noopener"
          className="adm-body rounded-[4px] border border-ink-50 px-3 py-2 text-forest hover:bg-ink-05"
        >
          공개 페이지에서 보기
        </a>
      </div>

      {slides.map((slide, index) => (
        <section key={index} className="rounded-[6px] border border-ink-15 bg-white">
          <div className="flex h-11 items-center gap-2 border-b border-ink-10 px-3">
            <span className="adm-mono w-6 shrink-0 text-center text-ink-70">{index + 1}</span>
            <span className="adm-h min-w-0 flex-1 truncate text-forest">
              {slide.title || "(제목 없음)"}
            </span>
            <button
              type="button"
              aria-label={`${index + 1}번째를 위로`}
              disabled={index === 0}
              onClick={() => move(index, -1)}
              className="adm-body size-8 rounded-[4px] text-forest hover:bg-ink-05 disabled:opacity-45"
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={`${index + 1}번째를 아래로`}
              disabled={index === slides.length - 1}
              onClick={() => move(index, 1)}
              className="adm-body size-8 rounded-[4px] text-forest hover:bg-ink-05 disabled:opacity-45"
            >
              ↓
            </button>
            {slides.length > 1 ? (
              <button
                type="button"
                aria-label={`${index + 1}번째 삭제`}
                onClick={() => setSlides((current) => current.filter((_, i) => i !== index))}
                className="adm-body size-8 rounded-[4px] text-danger hover:bg-danger-tint"
              >
                삭제
              </button>
            ) : null}
          </div>

          <div className="grid gap-5 p-4 lg:grid-cols-2">
            <div>
              <ImageSlot
                name={`hero.${index}.image`}
                value={slide.image}
                tone={slide.tone}
                onChange={(url) => update(index, { image: url })}
              >
                <div className="pointer-events-none absolute inset-x-4 bottom-10 text-white">
                  {slide.eyebrow ? (
                    <p className="c1 tracking-[0.2em] uppercase opacity-90">{slide.eyebrow}</p>
                  ) : null}
                  <p className="t1 mt-2 line-clamp-2">{slide.title || "제목을 적어 주세요"}</p>
                  {slide.body ? <p className="b3 mt-2 line-clamp-2 max-w-md opacity-90">{slide.body}</p> : null}
                </div>
              </ImageSlot>
              <div className="mt-4">
                <ToneSelect
                  name={`hero.${index}.tone`}
                  value={slide.tone}
                  onChange={(tone: PhotoTone) => update(index, { tone })}
                />
              </div>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">작은 제목</span>
                <input
                  className={ADM_INPUT}
                  name={`hero.${index}.eyebrow`}
                  value={slide.eyebrow}
                  onChange={(event) => update(index, { eyebrow: event.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-baseline justify-between">
                  <span className="adm-label text-forest-70">제목</span>
                  <span className={cn("adm-meta tabular-nums", warnClass(slide.title.length, 28))}>
                    {slide.title.length}/20자
                  </span>
                </span>
                <input
                  className={ADM_INPUT}
                  name={`hero.${index}.title`}
                  value={slide.title}
                  onChange={(event) => update(index, { title: event.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-baseline justify-between">
                  <span className="adm-label text-forest-70">본문</span>
                  <span className={cn("adm-meta tabular-nums", warnClass(slide.body.length, 120))}>
                    {slide.body.length}/90자
                  </span>
                </span>
                <textarea
                  className={ADM_AREA}
                  name={`hero.${index}.body`}
                  value={slide.body}
                  onChange={(event) => update(index, { body: event.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-baseline justify-between">
                  <span className="adm-label text-forest-70">버튼 문구</span>
                  <span className={cn("adm-meta tabular-nums", warnClass(slide.cta.label.length, 16))}>
                    {slide.cta.label.length}/12자
                  </span>
                </span>
                <input
                  className={ADM_INPUT}
                  name={`hero.${index}.ctaLabel`}
                  value={slide.cta.label}
                  onChange={(event) => update(index, { cta: { ...slide.cta, label: event.target.value } })}
                />
              </label>
              <AnchorSelect
                name={`hero.${index}.ctaHref`}
                value={slide.cta.href}
                onChange={(href) => update(index, { cta: { ...slide.cta, href } })}
              />
              <input type="hidden" name={`hero.${index}.video`} value={slide.video} />
            </div>
          </div>
        </section>
      ))}

      {slides.length < 5 ? (
        <button
          type="button"
          onClick={() => setSlides((current) => [...current, emptySlide()])}
          className="adm-body h-10 rounded-[4px] border border-ink-50 px-4 text-forest hover:bg-white"
        >
          화면 추가
        </button>
      ) : (
        <p className="adm-body text-ink-70">화면은 5장까지입니다. 더 넣으면 방문자가 끝까지 보지 않습니다.</p>
      )}

      <SaveBar
        status={status}
        pending={pending}
        disabled={!canSave}
        onReset={() => setSlides(saved)}
      />
    </form>
  );
}
