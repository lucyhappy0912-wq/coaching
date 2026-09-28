import { Photo } from "@/components/ui/Photo";
import { HOME_VISUAL } from "@/lib/visual";
import type { CmsPages } from "@/lib/cms/types";

export function HomeHero({ moment }: { moment: CmsPages["home"]["moment"] }) {
  return (
    <section className="bg-[#f7f6f3] pt-(--header-h)">
      <div className="grid min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="flex flex-col justify-end px-(--gutter) py-16 lg:py-24">
          <p className="c1 tracking-[0.22em] text-ink-50 uppercase">멈춘자</p>
          <h1 className="serif mt-6 text-[40px] leading-[0.95] tracking-[-0.03em] text-ink lg:text-[72px]">
            PAUSE.
            <br />
            TRANSITION.
            <br />
            NEXT.
          </h1>
          <p className="serif mt-10 max-w-xl text-[22px] leading-snug text-ink-90 lg:text-[28px]">
            {moment.lines[2]}
          </p>
          <p className="b2 mt-6 max-w-md text-ink-70">{moment.body}</p>
        </div>
        <div className="relative min-h-[42svh] lg:min-h-full">
          <Photo
            src={HOME_VISUAL.hero}
            alt=""
            tone="paper"
            priority
            objectPosition="center 70%"
            className="absolute inset-0"
            sizes="(min-width: 1025px) 46vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
