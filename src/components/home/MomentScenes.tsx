import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import type { CmsHomeProgram } from "@/lib/cms/types";
import { HOME_MOMENT } from "@/lib/content";
import { cn } from "@/lib/utils";

const RAIL: Record<
  string,
  { bg: string; line: string; lead: string; link: string; photoScrim: boolean }
> = {
  sage: {
    bg: "bg-grass-10",
    line: "text-forest",
    lead: "text-ink-90",
    link: "text-forest",
    photoScrim: false,
  },
  paper: {
    bg: "bg-[#f7f4ee]",
    line: "text-forest",
    lead: "text-ink-90",
    link: "text-forest",
    photoScrim: false,
  },
  forest: {
    bg: "bg-forest",
    line: "text-white",
    lead: "text-white/88",
    link: "text-white",
    photoScrim: true,
  },
};

export function MomentScenes({ scenes }: { scenes: CmsHomeProgram[] }) {
  return (
    <div>
      <div className="flex min-h-[24svh] items-end bg-grass-10 px-(--gutter) pb-10 lg:min-h-[32svh] lg:pb-14">
        <p className="c1 tracking-[0.18em] text-forest uppercase">{HOME_MOMENT.eyebrow}</p>
      </div>
      {scenes.map((item, index) => {
        const rail = RAIL[item.tone] ?? RAIL.sage;
        const railLeft = index !== 1;

        return (
          <section key={item.id} className="flex flex-col lg:min-h-[82svh] lg:flex-row">
            <div
              className={cn(
                "relative min-h-[50svh] overflow-hidden lg:w-1/2",
                railLeft && "lg:order-2",
              )}
            >
              <Photo
                src={item.image}
                video={item.video}
                tone={item.tone}
                alt={item.line}
                className="absolute inset-0"
              />
              {rail.photoScrim ? <div className="absolute inset-0 bg-black/20" /> : null}
            </div>
            <div
              className={cn(
                "px-(--gutter) py-16 lg:w-1/2 lg:px-16 lg:py-24",
                rail.bg,
                railLeft && "lg:order-1",
              )}
            >
              <p
                className={cn(
                  "c1 mb-5 tracking-[0.16em] uppercase",
                  item.tone === "forest" ? "text-white/70" : "text-stem",
                )}
              >
                {HOME_MOMENT.eyebrow}
              </p>
              <h2 className={cn("serif t1", rail.line)}>{item.line}</h2>
              <p className={cn("b2 mt-8 max-w-(--measure-narrow) break-keep", rail.lead)}>
                {item.lead[0]}
              </p>
              <LinedLink href={item.href} className={cn("mt-8", rail.link)}>
                {item.cta}
              </LinedLink>
            </div>
          </section>
        );
      })}
    </div>
  );
}
