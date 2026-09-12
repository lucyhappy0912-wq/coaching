"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Photo } from "@/components/ui/Photo";
import type { CmsPages } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

import { AboutRail, MOMENT_LINKS } from "./HinokPage";

export function StoryFilm({ slides }: { slides: CmsPages["story"]["slides"] }) {
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
    <section className="relative h-svh min-h-[640px] overflow-hidden bg-forest text-white">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Photo src={slide.image} video={slide.video} tone={slide.tone} alt="" className="absolute inset-0" />
          <div className="absolute inset-0 bg-black/35" />
        </div>
      ))}

      <div className="absolute top-[calc(var(--header-h)+28px)] left-(--gutter) z-10 hidden lg:block">
        <AboutRail title="The Moment" links={MOMENT_LINKS} current="/story" variant="dark" />
      </div>

      <div className="absolute top-[calc(var(--header-h)+48px)] bottom-16 left-(--gutter) right-(--gutter) z-10 max-w-[520px] lg:left-1/2 lg:right-(--gutter) lg:max-w-none">
        <h1 className="text-[26px] leading-snug whitespace-pre-line lg:text-[30px]">{current.title}</h1>
        <div className="b3 mt-6 max-w-[500px] space-y-5 text-white/90">
          {current.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <ol className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <li key={slide.id}>
            <button
              type="button"
              aria-label={`${i + 1}번째 장면`}
              aria-current={i === index ? true : undefined}
              onClick={() => go(i)}
              className={cn(
                "block h-[2px] w-8 transition-opacity",
                i === index ? "bg-white" : "bg-white/35 hover:bg-white/60",
              )}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
