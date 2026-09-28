"use client";

import { useRef } from "react";

import { Photo } from "@/components/ui/Photo";
import { HOME_VISUAL } from "@/lib/visual";
import type { CmsPages } from "@/lib/cms/types";
import { useScrollProgress } from "@/lib/use-scroll-progress";
import { cn } from "@/lib/utils";

export function HomeHero({ moment }: { moment: CmsPages["home"]["moment"] }) {
  const track = useRef<HTMLElement>(null);
  const { progress, reduce } = useScrollProgress(track);
  const show = (from: number) => reduce || progress >= from;

  return (
    <section ref={track} className="relative h-auto lg:motion-safe:h-[180svh]">
      <div className="bg-[#f7f6f3] lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh">
        <div className="grid h-full min-h-[560px] pt-(--header-h) lg:min-h-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="flex flex-col justify-end px-(--gutter) py-16 lg:py-24">
            <p className="c1 tracking-[0.22em] text-ink-50 uppercase">멈춘자</p>
            <h1
              className={cn(
                "serif mt-6 text-[40px] leading-[0.95] tracking-[-0.03em] text-ink transition-opacity duration-700 lg:text-[72px]",
                !reduce && progress >= 0.42 ? "opacity-45" : "opacity-100",
              )}
            >
              PAUSE.
              <br />
              TRANSITION.
              <br />
              NEXT.
            </h1>
            <p
              className={cn(
                "serif mt-10 max-w-xl text-[22px] leading-snug text-ink-90 transition-all duration-700 lg:text-[28px]",
                show(0.16) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              {moment.lines[0]}
            </p>
            <p
              className={cn(
                "serif mt-3 text-[22px] leading-snug text-ink transition-all duration-700 lg:text-[28px]",
                show(0.36) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              {moment.lines[1]} {moment.lines[2]}
            </p>
            <p
              className={cn(
                "b2 mt-6 max-w-md text-ink-70 transition-all duration-700",
                show(0.56) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              {moment.body}
            </p>
          </div>
          <div className="relative min-h-[42svh] overflow-hidden lg:min-h-full">
            <Photo
              src={HOME_VISUAL.hero}
              alt=""
              tone="paper"
              priority
              objectPosition="center 70%"
              className="absolute inset-0 hero-kenburns"
              sizes="(min-width: 1025px) 46vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
