import type { Metadata } from "next";
import Link from "next/link";

import { LinedLink } from "@/components/ui/Buttons";
import { getContent } from "@/lib/cms/store";
import { PROGRAM_TEASERS } from "@/lib/content";
import { visibleByHref } from "@/lib/menu";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Coaching",
  description: "Stage, Next Chapter, Founder. 세 가지 전환 가운데 지금 가까운 곳을 고르면 됩니다.",
};

const BAR: Record<string, string> = {
  sage: "bg-grass",
  paper: "bg-[#d9d6cc]",
  forest: "bg-forest",
};

export default async function CoachingIndexPage() {
  const { menuOff } = await getContent();
  const teasers = visibleByHref(PROGRAM_TEASERS, menuOff);

  return (
    <div className="bg-white pt-(--header-h)">
      <div className="mx-auto max-w-[900px] px-(--gutter) pt-16 pb-24 lg:pt-24">
        <p className="text-[18px] text-forest">세 가지 전환</p>
        <p className="b3 mt-3 max-w-(--measure-narrow) text-ink-90">
          삶의 다음 무대, 인생의 다음 장, 창업자에서 리더로.
        </p>

        <ul className="mt-16 [&:hover_li]:opacity-35 [&_li:hover]:opacity-100">
          {teasers.map((item) => (
            <li
              key={item.id}
              className="flex gap-5 border-t border-ink-10 py-8 transition-opacity duration-300 last:border-b lg:gap-8 lg:py-10"
            >
              <span
                aria-hidden
                className={cn("w-2 shrink-0 self-stretch", BAR[item.tone] ?? "bg-grass")}
              />
              <div>
                <Link
                  href={item.href}
                  className="serif block text-[34px] leading-[1.15] text-forest lg:text-[48px]"
                >
                  {item.line}
                </Link>
                <p className="b3 mt-4 max-w-(--measure-narrow) text-ink-90">{item.lead[0]}</p>
                <LinedLink href={item.href} className="mt-5 inline-block">
                  {item.cta}
                </LinedLink>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
