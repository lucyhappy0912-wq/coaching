import { Photo } from "@/components/ui/Photo";
import { HOME_MOMENT } from "@/lib/content";
import { HOME_VISUAL } from "@/lib/visual";

export function HomeHero() {
  return (
    <section className="bg-[#f7f6f3]">
      <div className="grid min-h-svh pt-(--header-h) lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="flex flex-col justify-center px-(--gutter) py-8 lg:py-12">
          <p className="c1 tracking-[0.22em] text-ink-50 uppercase">{HOME_MOMENT.eyebrow}</p>
          <h1 className="serif mt-5 text-[32px] leading-[1.12] tracking-[-0.03em] text-ink lg:text-[42px]">
            {HOME_MOMENT.lines[0]}
            <br />
            {HOME_MOMENT.lines[1]}
          </h1>
          <p className="serif mt-6 max-w-xl whitespace-pre-line text-[20px] leading-[1.65] text-ink-90 lg:text-[22px]">
            {HOME_MOMENT.body}
          </p>
        </div>
        <div className="relative min-h-[42svh] overflow-hidden lg:min-h-full">
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
