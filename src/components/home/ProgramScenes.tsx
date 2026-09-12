import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import type { CmsHomeProgram } from "@/lib/cms/types";
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

export function ProgramScenes({ programs }: { programs: CmsHomeProgram[] }) {
  return (
    <div>
      {programs.map((item, index) => {
        const rail = RAIL[item.tone] ?? RAIL.sage;
        const railLeft = index !== 1;

        return (
          <section
            key={item.id}
            className="flex min-h-svh flex-col lg:min-h-svh lg:flex-row"
          >
            <div
              className={cn(
                "relative min-h-[58svh] overflow-hidden lg:min-h-svh lg:w-[60%]",
                railLeft && "lg:order-2"
              )}
            >
              <Photo src={item.image} video={item.video} tone={item.tone} alt={item.line} className="absolute inset-0" />
              {rail.photoScrim ? <div className="absolute inset-0 bg-black/20" /> : null}
            </div>
            <div
              className={cn(
                "flex min-h-[42svh] items-center px-(--gutter) py-12 lg:w-[40%] lg:px-14",
                rail.bg,
                railLeft && "lg:order-1"
              )}
            >
              <div className="max-w-md">
                <h2
                  className={cn(
                    "serif text-[26px] leading-[1.2] md:text-[32px] lg:text-[40px]",
                    rail.line
                  )}
                >
                  {item.line}
                </h2>
                <p className={cn("b2 mt-6", rail.lead)}>{item.lead[0]}</p>
                <LinedLink href={item.href} className={cn("mt-8 inline-block", rail.link)}>
                  {item.cta}
                </LinedLink>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
