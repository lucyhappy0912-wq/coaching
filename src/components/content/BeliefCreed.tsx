import { Photo } from "@/components/ui/Photo";
import type { CmsPages } from "@/lib/cms/types";

import { AboutRail, MOMENT_LINKS } from "./HinokPage";

export function BeliefCreed({ page }: { page: CmsPages["belief"] }) {
  return (
    <div className="bg-[#111]">
      <section className="relative h-svh min-h-[640px] overflow-hidden text-white">
        <Photo src={page.hero.image} video={page.hero.video} tone={page.hero.tone} alt={page.hero.line} className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-[calc(var(--header-h)+28px)] left-(--gutter) z-10 hidden lg:block">
          <AboutRail title="The Moment" links={MOMENT_LINKS} current="/belief" variant="dark" />
        </div>
        <div className="relative z-10 flex h-full items-end px-(--gutter) pb-16 lg:pb-24">
          <div className="max-w-3xl">
            <p className="serif text-[28px] leading-[1.15] lg:text-[44px]">{page.hero.chain}</p>
            <p className="b1 mt-6 text-white/90">{page.hero.line}</p>
          </div>
        </div>
      </section>

      {page.items.map((item, index) => {
        const dark = index % 2 === 0;
        return (
          <section
            key={item.en}
            className={dark ? "relative min-h-svh overflow-hidden text-white" : "min-h-svh bg-[#f7f4ee] text-forest"}
          >
            {dark ? (
              <>
                <Photo src={item.image} video={item.video} tone={item.tone} alt={item.en} className="absolute inset-0" />
                <div className="absolute inset-0 bg-black/45" />
              </>
            ) : null}
            <div className="relative z-10 mx-auto flex min-h-svh max-w-[1100px] flex-col justify-end px-(--gutter) py-20 lg:justify-center lg:py-28">
              <p className="serif text-[56px] leading-none lg:text-[96px]">{item.en}</p>
              <h2 className="mt-6 text-[22px] leading-snug lg:text-[28px]">{item.title}</h2>
              <div className={`b2 mt-8 max-w-(--measure-narrow) space-y-5 ${dark ? "text-white/88" : "text-ink-90"}`}>
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="flex min-h-[70vh] items-center bg-forest px-(--gutter) py-24 text-white">
        <div className="mx-auto max-w-(--measure-narrow)">
          {page.close.map((line) => (
            <p key={line} className="serif mt-4 text-[28px] leading-snug first:mt-0 lg:text-[40px]">
              {line}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
