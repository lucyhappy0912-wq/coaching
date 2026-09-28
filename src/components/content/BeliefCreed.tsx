import { PageHero } from "@/components/content/PageHero";
import type { CmsPages } from "@/lib/cms/types";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";
import { cn } from "@/lib/utils";

import { AboutRail, MOMENT_LINKS } from "./HinokPage";

export function BeliefCreed({ page }: { page: CmsPages["belief"] }) {
  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow={page.hero.chain}
        title={page.hero.line}
        image={HOME_VISUAL.pause}
        objectPosition={VISUAL_POS.pause}
        rail={<AboutRail title="The Moment" links={MOMENT_LINKS} current="/belief" />}
      />

      {page.items.map((item, index) => (
        <section
          key={item.en}
          className={cn("px-(--gutter) py-20 lg:py-28", index % 2 === 0 ? "bg-[#f7f6f3]" : "bg-white")}
        >
          <div className="mx-auto max-w-[1100px]">
            <p className="serif text-[56px] leading-none text-ink lg:text-[96px]">{item.en}</p>
            <h2 className="mt-6 text-[22px] leading-snug text-ink lg:text-[28px]">{item.title}</h2>
            <div className="b2 mt-8 max-w-(--measure-narrow) space-y-5 text-ink-70">
              {item.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-[#f7f6f3] px-(--gutter) py-24 lg:py-32">
        <div className="mx-auto max-w-(--measure-narrow)">
          {page.close.map((line) => (
            <p key={line} className="serif mt-4 text-[28px] leading-snug text-ink first:mt-0 lg:text-[40px]">
              {line}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
