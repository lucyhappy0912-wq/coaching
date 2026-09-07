"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PillButton } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import { HERO_SLIDES } from "@/lib/site";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const count = HERO_SLIDES.length;

  const go = (next: number) => setIndex((next + count) % count);

  useEffect(() => {
    const timer = setInterval(() => setIndex((v) => (v + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <section
      id="hero"
      className="relative h-[calc(100svh-var(--banner-h))] min-h-[520px] overflow-hidden"
    >
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.title}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <Photo src={slide.image} tone={slide.tone} priority={i === 0} />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-black/25" />

          <div className="absolute bottom-14 left-(--gutter) max-w-xl text-white lg:bottom-16">
            <p className="c1 tracking-[0.2em] uppercase opacity-90">{slide.eyebrow}</p>
            <h2 className="t1 mt-3">{slide.title}</h2>
            <p className="b3 mt-5 max-w-md leading-relaxed opacity-90">{slide.body}</p>
            <PillButton href={slide.cta.href} variant="solid" className="mt-7">
              {slide.cta.label}
            </PillButton>
          </div>
        </div>
      ))}

      <div className="absolute right-(--gutter) bottom-14 hidden items-center gap-3 lg:flex">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`${i + 1}번 슬라이드`}
            onClick={() => go(i)}
            className={cn(
              "h-px w-8 transition-colors",
              i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>

      <div className="absolute inset-x-(--gutter) top-1/2 hidden -translate-y-1/2 justify-between text-white/70 lg:flex">
        <button
          type="button"
          aria-label="이전 슬라이드"
          onClick={() => go(index - 1)}
          className="transition-colors hover:text-white"
        >
          <ChevronLeft className="size-8" strokeWidth={1} />
        </button>
        <button
          type="button"
          aria-label="다음 슬라이드"
          onClick={() => go(index + 1)}
          className="transition-colors hover:text-white"
        >
          <ChevronRight className="size-8" strokeWidth={1} />
        </button>
      </div>
    </section>
  );
}
