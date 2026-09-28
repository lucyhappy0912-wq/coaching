import Link from "next/link";

import { PageHero } from "@/components/content/PageHero";
import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import type { CmsHomeProgram } from "@/lib/cms/types";
import { HOME_VISUAL } from "@/lib/visual";
import { cn } from "@/lib/utils";

import { AboutRail, COACHING_LINKS } from "./HinokPage";

export type CoachingScene = CmsHomeProgram & {
  axis?: string;
  process?: string[];
};

const PROGRAM_IMAGE: Record<string, string> = {
  stage: HOME_VISUAL.stairs,
  "next-chapter": HOME_VISUAL.next,
  founder: HOME_VISUAL.founder,
};

export function CoachingFilm({
  programs,
  openHrefs,
}: {
  programs: CoachingScene[];
  openHrefs: readonly string[];
}) {
  const open = new Set(openHrefs);

  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow="Coaching"
        title="세 가지 전환"
        lead="삶의 다음 무대, 인생의 다음 장, 창업자에서 리더로."
        image={HOME_VISUAL.transition}
        objectPosition="center 60%"
        rail={
          <AboutRail
            title="Coaching"
            links={COACHING_LINKS.filter((item) => open.has(item.href))}
            current="/coaching"
          />
        }
      />

      {programs.map((item, index) => {
        const shown = open.has(item.href);
        const dark = index === 1;

        return (
          <section
            key={item.id}
            id={item.id}
            className={cn(
              "grid scroll-mt-(--header-h) lg:min-h-[78svh] lg:grid-cols-[1.15fr_0.85fr]",
              dark ? "bg-[#111] text-white" : index % 2 === 0 ? "bg-[#f7f6f3] text-ink" : "bg-white text-ink",
            )}
          >
            <Reveal
              className={cn(
                "flex flex-col justify-center px-(--gutter) py-16 lg:px-16 lg:py-24",
                index % 2 === 1 && "lg:order-1",
              )}
            >
              <p className={cn("c1 tracking-[0.14em] uppercase", dark ? "text-white/45" : "text-ink-50")}>
                {item.eyebrow}
              </p>
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
              {item.axis ? (
                <p className={cn("mt-3 text-[13px]", dark ? "text-white/45" : "text-ink-50")}>{item.axis}</p>
              ) : null}
              <div className={cn("b3 mt-6 max-w-md space-y-4", dark ? "text-white/78" : "text-ink-70")}>
                {item.lead.slice(0, 2).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {item.process?.length ? (
                <p className={cn("mt-6 text-[12px] tracking-[0.04em]", dark ? "text-white/40" : "text-ink-50")}>
                  {item.process.join(" · ")}
                </p>
              ) : null}
              {shown ? (
                <LinedLink href={item.href} className={cn("mt-8 inline-block", dark ? "text-white" : "text-forest")}>
                  {item.cta}
                </LinedLink>
              ) : null}
            </Reveal>
            <Reveal
              delay={0.08}
              className={cn(
                "relative min-h-[46svh] overflow-hidden lg:min-h-full",
                index % 2 === 1 && "lg:order-2",
              )}
            >
              <Photo
                src={PROGRAM_IMAGE[item.id] ?? HOME_VISUAL.transition}
                tone="paper"
                alt={item.line}
                className="absolute inset-0 hero-kenburns"
                sizes="(min-width: 1025px) 40vw, 100vw"
              />
            </Reveal>
          </section>
        );
      })}
    </div>
  );
}
