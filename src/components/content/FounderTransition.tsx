import { PageHero } from "@/components/content/PageHero";
import { ProcessPin } from "@/components/content/ProcessPin";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { FOUNDER_TRANSITION } from "@/lib/founder-transition";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export function FounderTransition() {
  const copy = FOUNDER_TRANSITION;
  const questions = new Map(copy.table.map((row) => [row.week, row.question]));

  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lead={
          <div className="space-y-2">
            {copy.hero.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        }
        image={HOME_VISUAL.founder}
        objectPosition={VISUAL_POS.founder}
      />

      <section className="bg-[#f7f6f3] px-(--gutter) py-16 lg:py-24">
        <Reveal className="mx-auto max-w-md">
          <p className="c1 tracking-[0.22em] text-ink-50 uppercase">{copy.hero.axis}</p>
          <p className="serif mt-6 text-[26px] leading-snug text-ink lg:text-[32px]">{copy.program.body[0]}</p>
          {copy.program.body.slice(1).map((paragraph) => (
            <p key={paragraph} className="b2 mt-6 text-ink-70">
              {paragraph}
            </p>
          ))}
          <div className="b2 mt-8 space-y-1 text-ink-70">
            {copy.hero.close.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-(--gutter) py-20 lg:py-28">
        <Reveal>
        <p className="serif text-[32px] text-ink lg:text-[48px]">{copy.after.title}</p>
        <p className="b2 mt-5 max-w-(--measure-narrow) text-ink-70">{copy.after.lead}</p>
        <ul className="b2 mt-8 max-w-(--measure) space-y-2 text-ink-70">
          {copy.after.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="b2 mt-4 max-w-(--measure-narrow) text-ink-70">{copy.after.close}</p>
        <ul className="mt-16">
          {copy.after.pairs.map((pair) => (
            <li
              key={pair.before}
              className="grid gap-4 border-t border-ink-10 py-8 last:border-b lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10"
            >
              <p className="b2 text-ink-50">{pair.before}</p>
              <span aria-hidden className="hidden text-ink-30 lg:block">
                →
              </span>
              <p className="serif text-[18px] leading-snug text-ink lg:text-[22px]">{pair.after}</p>
            </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <ProcessPin steps={copy.hero.process} />

      <section className="px-(--gutter) py-20 lg:py-28">
        <Reveal>
          <p className="serif text-[32px] text-ink lg:text-[48px]">{copy.close.eyebrow}</p>
          <div className="b2 mt-8 max-w-(--measure-narrow) space-y-4 text-ink-70">
            {copy.close.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </section>

      {copy.weeks.map((item) => {
        const question = questions.get(item.week);
        return (
          <section key={item.week} className="border-t border-ink-10 px-(--gutter) py-16 lg:px-16">
            <Reveal className="mx-auto max-w-md">
              <p className="serif text-[36px] leading-none text-ink-10">{item.week}</p>
              <p className="c1 mt-5 tracking-[0.2em] text-ink-50 uppercase">{item.stage}</p>
              <h2 className="serif mt-3 text-[26px] leading-snug text-ink lg:text-[32px]">{item.title}</h2>
              {question ? <p className="b2 mt-5 text-ink">{question}</p> : null}
              <div className="b2 mt-6 space-y-4 text-ink-70">
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </section>
        );
      })}

      <section className="grid bg-[#f7f6f3] lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal className="flex flex-col justify-center px-(--gutter) py-16 lg:px-16 lg:py-24">
          <p className="c1 tracking-[0.22em] text-ink-50 uppercase">{copy.next.eyebrow}</p>
          <h2 className="serif mt-4 max-w-5xl text-[32px] leading-[1.1] text-ink lg:text-[48px]">{copy.next.line}</h2>
          <div className="b2 mt-8 max-w-(--measure-narrow) space-y-4 text-ink-70">
            {copy.next.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08} className="relative min-h-[42svh] overflow-hidden lg:min-h-full">
          <Photo
            src={HOME_VISUAL.next}
            tone="paper"
            alt=""
            objectPosition={VISUAL_POS.next}
            className="absolute inset-0 hero-kenburns"
            sizes="(min-width: 1025px) 42vw, 100vw"
          />
        </Reveal>
      </section>
    </div>
  );
}
