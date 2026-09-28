import { PageHero } from "@/components/content/PageHero";
import { Photo } from "@/components/ui/Photo";
import type { CmsPages } from "@/lib/cms/types";
import { HOME_VISUAL, VISUAL_POS, WAY_CYCLE } from "@/lib/visual";
import { cn } from "@/lib/utils";

import { AboutRail, MOMENT_LINKS } from "./HinokPage";

export function WayFilm({ page }: { page: CmsPages["way"] }) {
  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        image={HOME_VISUAL.transition}
        objectPosition={VISUAL_POS.transition}
        rail={<AboutRail title="The Moment" links={MOMENT_LINKS} current="/way" />}
      />

      {page.items.map((item, index) => (
        <section
          key={item.no}
          className={cn(
            "grid lg:min-h-[78svh] lg:grid-cols-[1.1fr_0.9fr]",
            index % 2 === 0 ? "bg-[#f7f6f3]" : "bg-white",
          )}
        >
          <div
            className={cn(
              "flex flex-col justify-center px-(--gutter) py-16 lg:px-16 lg:py-24",
              index % 2 === 1 && "lg:order-2",
            )}
          >
            <div className="b2 max-w-(--measure-narrow) space-y-6 text-ink-70">
              <p>{item.body[0]}</p>
              {item.body[1] ? <p>{item.body[1]}</p> : null}
            </div>
          </div>
          <div
            className={cn(
              "relative min-h-[42svh] overflow-hidden lg:min-h-full",
              index % 2 === 1 && "lg:order-1",
            )}
          >
            <Photo
              src={WAY_CYCLE[index % WAY_CYCLE.length]}
              tone="paper"
              alt={item.title}
              className="absolute inset-0"
              sizes="(min-width: 1025px) 42vw, 100vw"
            />
          </div>
        </section>
      ))}
    </div>
  );
}
