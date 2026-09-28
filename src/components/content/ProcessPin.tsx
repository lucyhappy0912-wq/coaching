"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import { useScrollProgress } from "@/lib/use-scroll-progress";
import { cn } from "@/lib/utils";

export function ProcessPin({
  eyebrow = "Process",
  steps,
}: {
  eyebrow?: string;
  steps: readonly string[];
}) {
  const track = useRef<HTMLElement>(null);
  const { progress, reduce } = useScrollProgress(track);
  const step = Math.min(steps.length - 1, Math.floor(progress * steps.length));
  const current = steps[step] ?? steps[0];

  if (steps.length === 0) return null;

  if (reduce) {
    return (
      <section className="bg-[#f7f6f3] px-(--gutter) py-16 lg:py-24">
        <p className="c1 tracking-[0.2em] text-ink-50 uppercase">{eyebrow}</p>
        <ol className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {steps.map((item, index) => (
            <li key={item} className="serif text-[22px] text-ink lg:text-[28px]">
              <span className="mr-2 text-ink-30">{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section ref={track} className="relative h-[160svh] bg-[#f7f6f3] lg:h-[180svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center px-(--gutter) pt-(--header-h)">
        <div className="mx-auto w-full max-w-5xl">
          <p className="c1 tracking-[0.2em] text-ink-50 uppercase">{eyebrow}</p>
          <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-end">
            <ol className="hidden lg:block lg:space-y-3">
              {steps.map((item, index) => (
                <li key={item}>
                  <p
                    className={cn(
                      "serif text-[20px] leading-none tracking-[-0.02em] transition-opacity duration-500",
                      index === step ? "text-ink opacity-100" : "text-ink-50 opacity-35",
                    )}
                  >
                    {item}
                  </p>
                </li>
              ))}
            </ol>
            <div className="relative min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="c1 text-ink-50">{String(step + 1).padStart(2, "0")}</p>
                  <p className="serif mt-3 text-[40px] leading-none tracking-[-0.03em] text-ink lg:text-[64px]">
                    {current}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-12 h-px w-full max-w-xs bg-ink-10">
            <div
              className="h-px bg-ink transition-[width] duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
