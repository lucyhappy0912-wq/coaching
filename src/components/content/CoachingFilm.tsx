import Link from "next/link";

import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import type { CmsHomeProgram, MediaRef } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

import { AboutRail, COACHING_LINKS } from "./HinokPage";

export type CoachingScene = CmsHomeProgram & {
  axis?: string;
  process?: string[];
};

export function CoachingFilm({
  hero,
  programs,
  openHrefs,
}: {
  hero: MediaRef;
  programs: CoachingScene[];
  openHrefs: readonly string[];
}) {
  const open = new Set(openHrefs);

  return (
    <div className="bg-[#111]">
      <section className="relative h-svh min-h-[640px] overflow-hidden text-white">
        <Photo
          src={hero.image}
          video={hero.video}
          tone={hero.tone}
          alt="세 가지 전환"
          className="absolute inset-0"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute top-[calc(var(--header-h)+28px)] left-(--gutter) z-20 hidden lg:block">
          <AboutRail
            title="Coaching"
            links={COACHING_LINKS.filter((item) => open.has(item.href))}
            current="/coaching"
            variant="dark"
          />
        </div>

        <div className="pointer-events-none relative z-10 flex h-full items-end justify-center px-(--gutter) pb-16 text-center lg:pb-24">
          <div className="pointer-events-auto">
            <p className="text-[15px] tracking-[0.18em] text-white/70 uppercase">Coaching</p>
            <h1 className="serif mt-3 text-[40px] leading-none lg:text-[52px]">세 가지 전환</h1>
            <p className="mt-4 text-[15px] text-white/90 lg:text-[17px]">
              삶의 다음 무대, 인생의 다음 장, 창업자에서 리더로.
            </p>
          </div>
        </div>
      </section>

      {programs.map((item, index) => {
        const shown = open.has(item.href);

        return (
          <section
            key={item.id}
            id={item.id}
            className="flex min-h-svh scroll-mt-(--header-h) items-center justify-center px-(--gutter) py-16"
          >
            <div
              className={cn(
                "flex w-full max-w-[1400px] flex-col items-center lg:flex-row",
                index % 2 === 1 && "lg:flex-row-reverse",
              )}
            >
              <div className="relative aspect-10/11 w-full overflow-hidden lg:aspect-auto lg:h-[min(960px,calc(100svh-80px))] lg:w-1/2">
                <Photo
                  src={item.image}
                  video={item.video}
                  tone={item.tone}
                  alt={item.line}
                  className="absolute inset-0"
                />
              </div>
              <div className="flex w-full items-center px-0 py-10 lg:w-1/2 lg:px-14">
                <div className="max-w-(--measure-narrow) text-white">
                  <p className="text-[13px] tracking-[0.14em] text-white/55">{item.eyebrow}</p>
                  {shown ? (
                    <Link
                      href={item.href}
                      className="serif mt-3 block text-[32px] leading-[1.15] transition-opacity hover:opacity-70 lg:text-[40px]"
                    >
                      {item.line}
                    </Link>
                  ) : (
                    <h2 className="serif mt-3 text-[32px] leading-[1.15] lg:text-[40px]">{item.line}</h2>
                  )}
                  {item.axis ? <p className="mt-3 text-[13px] text-white/45">{item.axis}</p> : null}
                  <div className="b3 mt-6 space-y-4 text-white/88">
                    {item.lead.slice(0, 2).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  {item.process?.length ? (
                    <p className="mt-6 text-[12px] tracking-[0.04em] text-white/40">
                      {item.process.join(" · ")}
                    </p>
                  ) : null}
                  {shown ? (
                    <LinedLink href={item.href} className="mt-8 inline-block text-white">
                      {item.cta}
                    </LinedLink>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
