import { Photo } from "@/components/ui/Photo";
import type { CmsPages } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

import { AboutRail, MOMENT_LINKS } from "./HinokPage";

export function WayFilm({ page }: { page: CmsPages["way"] }) {
  return (
    <div className="bg-[#111]">
      <section className="relative h-svh min-h-[640px] overflow-hidden text-white">
        <Photo src={page.hero.image} video={page.hero.video} tone={page.hero.tone} alt={page.hero.title} className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute top-[calc(var(--header-h)+28px)] left-(--gutter) z-10 hidden lg:block">
          <AboutRail title="The Moment" links={MOMENT_LINKS} current="/way" variant="dark" />
        </div>

        <div className="relative z-10 flex h-full items-end justify-center px-(--gutter) pb-16 text-center lg:pb-24">
          <div>
            <h1 className="serif text-[40px] leading-none lg:text-[52px]">{page.hero.eyebrow}</h1>
            <p className="mt-4 text-[15px] text-white/90 lg:text-[17px]">{page.hero.title}</p>
          </div>
        </div>
      </section>

      {page.items.map((item, index) => (
        <section key={item.no} className="flex min-h-svh items-center justify-center px-(--gutter) py-16">
          <div
            className={cn(
              "flex w-full max-w-[1400px] flex-col items-center lg:flex-row",
              index % 2 === 1 && "lg:flex-row-reverse",
            )}
          >
            <div className="relative aspect-10/11 w-full overflow-hidden lg:aspect-auto lg:h-[min(960px,calc(100svh-80px))] lg:w-1/2">
              <Photo src={item.image} video={item.video} tone={item.tone} alt={item.title} className="absolute inset-0" />
            </div>
            <div className="flex w-full items-center px-0 py-10 lg:w-1/2 lg:px-14">
              <div className="max-w-[420px] text-white">
                <p className="b2 space-y-6">
                  <span className="block">{item.body[0]}</span>
                  <span className="mt-6 block">{item.body[1]}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
