"use client";

import { useState } from "react";

import { Photo } from "@/components/ui/Photo";
import { PROGRAM_CARDS, PROGRAM_TABS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ProgramTabs() {
  const [active, setActive] = useState<string>(PROGRAM_TABS[0].id);
  const cards = PROGRAM_CARDS.filter((card) => card.tabs.includes(active));

  return (
    <section id="program" className="py-16 lg:py-20">
      <div className="mb-5 flex gap-5 px-(--gutter) lg:gap-7">
        {PROGRAM_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "serif t3 transition-opacity",
              active === tab.id ? "lined opacity-100" : "opacity-35 hover:opacity-70"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 카드가 화면 오른쪽 끝으로 흘러 나가는 히녹의 가로 슬라이더 */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-2 lg:gap-6">
        {cards.map((card) => (
          <article
            key={card.name}
            className="w-[68%] shrink-0 snap-start sm:w-[45%] lg:w-[calc((100%-3rem)/3.4)]"
          >
            <div className="relative aspect-4/3 overflow-hidden">
              <Photo
                src={card.image}
                tone={card.tone}
                alt={card.name}
                sizes="(min-width: 1025px) 30vw, 70vw"
              />
              {card.badge && (
                <span className="c1 absolute top-3 left-3 bg-white/90 px-2 py-1 tracking-wider text-forest uppercase">
                  {card.badge}
                </span>
              )}
            </div>

            <div className="mt-5 text-center">
              <h3 className="serif text-[19px] lg:text-[22px]">{card.name}</h3>
              <p className="serif mt-1.5 text-[15px] lg:text-[17px]">
                {card.salePrice ? (
                  <>
                    <span className="mr-2 text-ink-50 line-through">{card.price}</span>
                    <span>{card.salePrice}</span>
                  </>
                ) : (
                  card.price
                )}
              </p>
              <p className="b3 mx-auto mt-3 max-w-[16rem] text-ink-70">{card.summary}</p>

              <a
                href="/consult"
                className="serif mt-5 inline-flex h-9 items-center justify-center rounded-sm bg-white px-6 text-sm text-forest shadow-[0_4px_4px_0_rgba(0,58,64,0.1)] ring-1 ring-ink-10 transition-colors hover:bg-grass-20"
              >
                상담 신청
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
