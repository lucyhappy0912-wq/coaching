"use client";

import { useEffect, useState, type RefObject } from "react";

export function useScrollProgress(track: RefObject<HTMLElement | null>) {
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
  }, [track]);

  return { progress, reduce };
}
