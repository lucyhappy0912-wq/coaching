"use client";

import { useState } from "react";

import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import { STORY_TABS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function StoryTabs() {
  const [active, setActive] = useState(0);
  const story = STORY_TABS[active];

  return (
    <section id="story" className="px-(--gutter) py-16 lg:py-20">
      <div className="flex flex-col gap-8 lg:flex-row-reverse lg:gap-10">
        <div className="lg:flex lg:w-[38%] lg:flex-col lg:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:block lg:space-y-2">
            {STORY_TABS.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "serif t2 text-left transition-opacity",
                    i === active ? "opacity-100" : "opacity-15 hover:opacity-50"
                  )}
                >
                  {item.tab}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 lg:mt-0">
            <h3 className="serif text-[20px] lg:text-[24px]">{story.title}</h3>
            <p className="b3 mt-3 max-w-sm text-ink-70">{story.body}</p>
            <LinedLink href={story.link.href} className="mt-5">
              {story.link.label}
            </LinedLink>
          </div>
        </div>

        <div className="relative aspect-4/3 w-full overflow-hidden lg:aspect-auto lg:h-[520px] lg:w-[62%]">
          <Photo
            src={story.image}
            tone={story.tone}
            alt={story.title}
            sizes="(min-width: 1025px) 60vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
