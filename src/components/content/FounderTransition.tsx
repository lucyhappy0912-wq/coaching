import { ConsultCta } from "@/components/content/Journey";
import { Photo } from "@/components/ui/Photo";
import type { MediaRef } from "@/lib/cms/types";
import { FOUNDER_TRANSITION } from "@/lib/founder-transition";

export function FounderTransition({ hero, split }: { hero: MediaRef; split: MediaRef }) {
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

      <section className="bg-white px-(--gutter) py-20 text-forest lg:py-28">
        <div className="mx-auto max-w-(--measure)">
          <p className="c1 tracking-[0.2em] text-stem uppercase">{copy.close.eyebrow}</p>
          <div className="reading b2 mt-6 text-ink-90">
            {copy.close.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ol className="mt-16">
            {copy.weeks.map((item) => (
              <li key={item.week} className="grid gap-5 border-t border-ink-10 py-10 lg:grid-cols-[88px_minmax(0,1fr)]">
                <p className="serif text-[36px] leading-none text-forest/25">{item.week}</p>
                <div>
                  <p className="c1 tracking-[0.2em] text-stem uppercase">{item.stage}</p>
                  <h2 className="t4 mt-2">{item.title}</h2>
                  {questions.get(item.week) ? (
                    <p className="serif mt-3 text-[22px] leading-snug lg:text-[26px]">{questions.get(item.week)}</p>
                  ) : null}
                  <div className="b2 mt-4 space-y-4 text-ink-90">
                    {item.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-(--gutter) py-20 lg:py-28">
        <p className="c1 tracking-[0.22em] text-white/55 uppercase">{copy.next.eyebrow}</p>
        <h2 className="serif mt-4 text-[32px] leading-none lg:text-[48px]">{copy.next.line}</h2>
        <div className="b2 mt-8 max-w-(--measure-narrow) space-y-4 text-white/70">
          {copy.next.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <ConsultCta
        title={copy.close.eyebrow}
        body={copy.next.body[copy.next.body.length - 1]}
      />
    </div>
  );
}
