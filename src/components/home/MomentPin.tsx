"use client";

import { useEffect, useRef, useState } from "react";

import { Photo } from "@/components/ui/Photo";
import type { CmsPages } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function MomentPin({ moment }: { moment: CmsPages["home"]["moment"] }) {
  const track = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduce = () => setReduce(media.matches);
    syncReduce();
    media.addEventListener("change", syncReduce);

    const onScroll = () => {
      const el = track.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(1);
        return;
      }
      setProgress(Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      media.removeEventListener("change", syncReduce);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const show = (from: number) => reduce || progress >= from;

  return (
    <section ref={track} className="relative h-auto motion-safe:h-[180svh]">
      <div className="relative min-h-[560px] overflow-hidden text-white motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:min-h-[640px]">
        <Photo
          src={moment.image}
          video={moment.video}
          tone={moment.tone}
          className="absolute inset-0 hero-kenburns hero-tone-drift"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-black/35" />

        <div className="absolute inset-x-(--gutter) bottom-16 z-10 max-w-xl lg:bottom-24">
          <h1
            className={cn(
              "serif text-[28px] leading-[1.25] transition-opacity duration-700 md:text-[34px] lg:text-[44px]",
              !reduce && progress >= 0.38 ? "opacity-55" : "opacity-100"
            )}
          >
            {moment.lines[0]}
          </h1>
          <p
            className={cn(
              "serif mt-8 text-[20px] tracking-[0.08em] text-white/80 transition-all duration-700 md:text-[24px] lg:text-[28px]",
              show(0.18) ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
            )}
          >
            {moment.lines[1]}
          </p>
          <p
            className={cn(
              "serif mt-3 max-w-xl text-[26px] leading-[1.25] transition-all duration-700 md:text-[32px] lg:text-[40px]",
              show(0.38) ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
            )}
          >
            {moment.lines[2]}
          </p>
          <p
            className={cn(
              "b2 mt-8 max-w-(--measure-narrow) text-white/88 transition-all duration-700",
              show(0.58) ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
            )}
          >
            {moment.body}
          </p>
        </div>
      </div>
    </section>
  );
}
