"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function LazyVideo({
  src,
  poster,
  className,
  style,
  alt,
  eager,
}: {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(Boolean(eager));

  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  return (
    <video
      ref={ref}
      className={cn("size-full object-cover", className)}
      style={style}
      src={active ? src : undefined}
      poster={poster || undefined}
      autoPlay={active}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      aria-hidden={!alt}
    />
  );
}
