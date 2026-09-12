"use client";

import { useEffect, useState } from "react";

import { TOP_MESSAGES } from "@/lib/site";

export function TopBanner({ messages = TOP_MESSAGES }: { messages?: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((v) => (v + 1) % messages.length), 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="fixed inset-x-0 top-0 z-60 h-(--banner-h) bg-grass-20 text-forest">
      <div className="relative flex h-full items-center justify-center px-(--gutter)">
        <div className="relative h-full w-full max-w-md overflow-hidden">
          {messages.map((message, i) => (
            <p
              key={message}
              className="c1 absolute inset-x-0 flex h-full items-center justify-center text-center transition-all duration-500"
              style={{
                opacity: i === index ? 1 : 0,
                transform: `translateY(${(i - index) * 100}%)`,
              }}
            >
              {message}
            </p>
          ))}
        </div>

        <p className="c1 absolute right-(--gutter) tracking-wide">
          <span className="font-semibold">KR</span>
          <span className="mx-1 opacity-40">/</span>
          <span className="opacity-60">EN</span>
        </p>
      </div>
    </div>
  );
}
