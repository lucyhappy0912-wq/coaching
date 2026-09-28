"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Photo } from "@/components/ui/Photo";
import type { CmsPages } from "@/lib/cms/types";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";
import { cn } from "@/lib/utils";

import { AboutRail, MOMENT_LINKS } from "./HinokPage";

const SLIDE_IMAGE = [HOME_VISUAL.stairs, HOME_VISUAL.pause, HOME_VISUAL.transition] as const;
const SLIDE_POS = [VISUAL_POS.stairs, VISUAL_POS.pause, VISUAL_POS.transition] as const;

export function StoryFilm({
  slides,
}: {
  slides: Pick<CmsPages["story"]["slides"][number], "id" | "title" | "lines">[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const lock = useRef(false);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      setIndex(clamped);
    },
    [slides.length],
  );

  useEffect(() => {
    if (window.location.hash.replace("#", "") === "belief") {
      router.replace("/belief");
    }
  }, [router]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (lock.current) return;
      if (Math.abs(event.deltaY) < 20) return;
      lock.current = true;
      go(index + (event.deltaY > 0 ? 1 : -1));
      window.setTimeout(() => {
        lock.current = false;
      }, 800);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [go, index]);

  const current = slides[index];
  if (!current) return null;

  return (
    <section className="bg-[#f7f6f3] pt-(--header-h) text-ink">
      <div className="relative grid min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="relative flex flex-col justify-end px-(--gutter) py-16 lg:py-24">
          <div className="absolute top-8 left-(--gutter) hidden lg:block">
            <AboutRail title="The Moment" links={MOMENT_LINKS} current="/story" />
          </div>
          <h1 className="break-keep text-[26px] leading-snug whitespace-pre-line text-ink lg:text-[36px]">
            {current.title}
          </h1>
          <div className="b2 mt-6 max-w-(--measure-narrow) space-y-5 text-ink-70">
            {current.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="relative min-h-[42svh] overflow-hidden lg:min-h-full">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              aria-hidden={i !== index}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                i === index ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Photo
                src={SLIDE_IMAGE[i] ?? HOME_VISUAL.transition}
                tone="paper"
                alt=""
                objectPosition={SLIDE_POS[i] ?? VISUAL_POS.transition}
                className="absolute inset-0"
                sizes="(min-width: 1025px) 46vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>

      <ol className="flex justify-center gap-2 bg-[#f7f6f3] pb-8">
        {slides.map((slide, i) => (
          <li key={slide.id}>
            <button
              type="button"
              aria-label={`${i + 1}번째 장면`}
              aria-current={i === index ? true : undefined}
              onClick={() => go(i)}
              className={cn(
                "block h-[2px] w-8 transition-opacity",
                i === index ? "bg-ink" : "bg-ink-30 hover:bg-ink-50",
              )}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
