"use client";

import { useRef } from "react";

import { Photo } from "@/components/ui/Photo";
import { useScrollProgress } from "@/lib/use-scroll-progress";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  objectPosition = "center",
  compact = false,
  rail,
}: {
  eyebrow: string;
  title: string;
  lead?: React.ReactNode;
  image: string;
  objectPosition?: string;
  compact?: boolean;
  rail?: React.ReactNode;
}) {
  const track = useRef<HTMLElement>(null);
  const { progress, reduce } = useScrollProgress(track);
  const pin = !compact && !reduce;
  const show = (from: number) => reduce || compact || progress >= from;

  return (
    <section ref={track} className={cn("relative", pin && "lg:h-[160svh]")}>
      <div className={cn("bg-[#f7f6f3]", pin && "lg:sticky lg:top-0 lg:h-svh")}>
        <div
          className={cn(
            "grid pt-(--header-h) lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
            compact
              ? "min-h-[56svh]"
              : pin
                ? "h-full min-h-[560px] lg:min-h-0"
                : "min-h-[calc(100svh-var(--header-h))]",
          )}
        >
          <div className="relative flex flex-col justify-end px-(--gutter) py-16 lg:py-24">
            {rail ? <div className="absolute top-8 left-(--gutter) hidden lg:block">{rail}</div> : null}
            <p className="c1 tracking-[0.22em] text-ink-50 uppercase">{eyebrow}</p>
            <h1
              className={cn(
                "serif mt-6 whitespace-pre-line text-[32px] leading-[1.1] tracking-[-0.02em] text-ink transition-opacity duration-700 lg:text-[52px]",
                pin && !reduce && progress >= 0.48 ? "opacity-45" : "opacity-100",
              )}
            >
              {title}
            </h1>
            {lead ? (
              <div
                className={cn(
                  "b2 mt-6 max-w-md text-ink-70 transition-all duration-700",
                  show(0.2) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
              >
                {lead}
              </div>
            ) : null}
          </div>
          <div
            className={cn(
              "relative overflow-hidden",
              compact ? "min-h-[32svh]" : "min-h-[42svh] lg:min-h-full",
            )}
          >
            <Photo
              src={image}
              tone="paper"
              alt=""
              priority
              objectPosition={objectPosition}
              className="absolute inset-0 hero-kenburns"
              sizes="(min-width: 1025px) 46vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
