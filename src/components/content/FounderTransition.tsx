import { ConsultCta } from "@/components/content/Journey";
import { Photo } from "@/components/ui/Photo";
import type { MediaRef } from "@/lib/cms/types";
import { FOUNDER_TRANSITION } from "@/lib/founder-transition";
import { cn } from "@/lib/utils";

export function FounderTransition({
  hero,
  split,
  weekMedia,
  nextHero,
}: {
  hero: MediaRef;
  split: MediaRef;
  weekMedia: MediaRef[];
  nextHero: MediaRef;
}) {
  const copy = FOUNDER_TRANSITION;
  const questions = new Map(copy.table.map((row) => [row.week, row.question]));

  return (
    <div className="bg-[#111] text-white">
      <header className="relative h-svh min-h-[640px] overflow-hidden">
        <Photo src={hero.image} video={hero.video} tone={hero.tone} alt={copy.hero.title} priority className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex h-full flex-col justify-end px-(--gutter) pb-16 lg:pb-24">
          <p className="c1 tracking-[0.22em] text-white/55 uppercase">{copy.hero.eyebrow}</p>
          <h1 className="serif mt-4 text-[44px] leading-none lg:text-[72px]">{copy.hero.title}</h1>
          <div className="b1 mt-6 max-w-(--measure-narrow) space-y-2 text-white/88">
            {copy.hero.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </header>

      <section className="grid lg:min-h-[70vh] lg:grid-cols-2">
        <div className="relative min-h-[46vh] overflow-hidden">
          <Photo src={split.image} video={split.video} tone={split.tone} alt={copy.program.body[0]} className="absolute inset-0" />
        </div>
        <div className="flex items-center px-(--gutter) py-16 lg:px-16">
          <div className="max-w-md">
            <p className="c1 tracking-[0.22em] text-white/55 uppercase">{copy.hero.axis}</p>
            <p className="serif mt-6 text-[26px] leading-snug lg:text-[32px]">{copy.program.body[0]}</p>
            {copy.program.body.slice(1).map((paragraph) => (
              <p key={paragraph} className="b2 mt-6 text-white/75">
                {paragraph}
              </p>
            ))}
            <div className="b2 mt-8 space-y-1 text-white/75">
              {copy.hero.close.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-(--gutter) py-20 lg:py-28">
        <p className="serif text-[32px] lg:text-[48px]">{copy.after.title}</p>
        <p className="b2 mt-5 max-w-(--measure-narrow) text-white/70">{copy.after.lead}</p>
        <ul className="b2 mt-8 max-w-(--measure) space-y-2 text-white/70">
          {copy.after.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="b2 mt-4 max-w-(--measure-narrow) text-white/70">{copy.after.close}</p>
        <ul className="mt-16">
          {copy.after.pairs.map((pair) => (
            <li
              key={pair.before}
              className="grid gap-4 border-t border-white/12 py-8 last:border-b lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10"
            >
              <p className="b2 text-white/40">{pair.before}</p>
              <span aria-hidden className="hidden text-white/25 lg:block">
                →
              </span>
              <p className="serif text-[18px] leading-snug lg:text-[22px]">{pair.after}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-forest px-(--gutter) py-16">
        <ol className="flex flex-wrap gap-x-10 gap-y-4">
          {copy.hero.process.map((step, index) => (
            <li key={step} className="serif text-[22px] text-white lg:text-[28px]">
              <span className="mr-2 text-white/35">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="px-(--gutter) py-20 lg:py-28">
        <p className="serif text-[32px] lg:text-[48px]">{copy.close.eyebrow}</p>
        <div className="b2 mt-8 max-w-(--measure-narrow) space-y-4 text-white/70">
          {copy.close.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {copy.weeks.map((item, index) => {
        const media = weekMedia[index] ?? split;
        const question = questions.get(item.week);
        return (
          <section key={item.week} className="grid lg:min-h-[70vh] lg:grid-cols-2">
            <div className={cn("relative min-h-[46vh] overflow-hidden", index % 2 === 1 && "lg:order-2")}>
              <Photo src={media.image} video={media.video} tone={media.tone} alt={item.title} className="absolute inset-0" />
            </div>
            <div className={cn("flex items-center px-(--gutter) py-16 lg:px-16", index % 2 === 1 && "lg:order-1")}>
              <div className="max-w-md">
                <p className="serif text-[36px] leading-none text-white/25">{item.week}</p>
                <p className="c1 mt-5 tracking-[0.2em] text-white/55 uppercase">{item.stage}</p>
                <h2 className="serif mt-3 text-[26px] leading-snug lg:text-[32px]">{item.title}</h2>
                {question ? <p className="b2 mt-5 text-white/88">{question}</p> : null}
                <div className="b2 mt-6 space-y-4 text-white/75">
                  {item.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="relative min-h-[70vh] overflow-hidden lg:min-h-svh">
        <Photo src={nextHero.image} video={nextHero.video} tone={nextHero.tone} alt={copy.next.line} className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex min-h-[70vh] flex-col justify-end px-(--gutter) py-16 lg:min-h-svh lg:py-24">
          <p className="c1 tracking-[0.22em] text-white/55 uppercase">{copy.next.eyebrow}</p>
          <h2 className="serif mt-4 max-w-5xl text-[32px] leading-[1.1] lg:text-[48px]">{copy.next.line}</h2>
          <div className="b2 mt-8 max-w-(--measure-narrow) space-y-4 text-white/85">
            {copy.next.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <ConsultCta
        title={copy.close.eyebrow}
        body={copy.next.body[copy.next.body.length - 1]}
      />
    </div>
  );
}
