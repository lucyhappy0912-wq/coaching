"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { HOME_PROCESS } from "@/lib/visual";
import { cn } from "@/lib/utils";

export function HomeProcess() {
  const track = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [reduce, setReduce] = useState(false);
  const current = HOME_PROCESS[step] ?? HOME_PROCESS[0];

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
        setStep(HOME_PROCESS.length - 1);
        return;
      }
      const progress = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      const next = Math.min(HOME_PROCESS.length - 1, Math.floor(progress * HOME_PROCESS.length));
      setStep(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      media.removeEventListener("change", syncReduce);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (reduce) {
    return (
      <section className="bg-[#f7f6f3]">
        <div className="mx-auto max-w-5xl px-(--gutter) py-24 lg:py-36">
          <p className="c1 tracking-[0.22em] text-ink-50 uppercase">How we transition</p>
          <ol className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-16">
            {HOME_PROCESS.map((item, index) => (
              <li key={item.key}>
                <p className="c1 text-ink-50">{String(index + 1).padStart(2, "0")}</p>
                <p className="serif mt-3 text-[32px] leading-none tracking-[-0.03em] text-ink lg:text-[40px]">
                  {item.key}
                </p>
                <p className="b2 mt-4 max-w-sm text-ink-70">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={track} className="relative h-[180svh] bg-[#f7f6f3] lg:h-[220svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center px-(--gutter) pt-(--header-h)">
        <div className="mx-auto w-full max-w-5xl">
          <p className="c1 tracking-[0.22em] text-ink-50 uppercase">How we transition</p>
          <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-end">
            <ol className="hidden lg:block lg:space-y-3">
              {HOME_PROCESS.map((item, index) => (
                <li key={item.key}>
                  <p
                    className={cn(
                      "serif text-[20px] leading-none tracking-[-0.02em] transition-opacity duration-500",
                      index === step ? "text-ink opacity-100" : "text-ink-50 opacity-35",
                    )}
                  >
                    {item.key}
                  </p>
                </li>
              ))}
            </ol>
            <div className="relative min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="c1 text-ink-50">{String(step + 1).padStart(2, "0")}</p>
                  <p className="serif mt-3 text-[48px] leading-none tracking-[-0.03em] text-ink lg:text-[72px]">
                    {current.key}
                  </p>
                  <p className="b2 mt-6 max-w-md text-ink-70">{current.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-12 h-px w-full max-w-xs bg-ink-10">
            <div
              className="h-px bg-ink transition-[width] duration-500"
              style={{ width: `${((step + 1) / HOME_PROCESS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
