import { HOME_MOMENT } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";

export function MomentHero() {
  return (
    <section className="relative h-svh min-h-[560px] overflow-hidden text-white">
      <div className="absolute inset-0">
        <Photo tone="forest" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <Container className="relative flex h-full flex-col justify-end pb-16 lg:pb-24">
        <p className="c1 tracking-[0.22em] text-white/70 uppercase">{HOME_MOMENT.eyebrow}</p>
        <h1 className="serif mt-5 max-w-3xl text-[32px] leading-[1.25] lg:text-[48px]">
          {HOME_MOMENT.lines[0]}
        </h1>
        <p className="serif mt-8 text-[26px] leading-snug lg:text-[36px]">{HOME_MOMENT.lines[1]}</p>
        <p className="serif mt-2 max-w-2xl text-[26px] leading-snug lg:text-[36px]">
          {HOME_MOMENT.lines[2]}
        </p>
        <p className="b2 mt-10 max-w-(--measure-narrow) text-white/88">{HOME_MOMENT.body}</p>
      </Container>
    </section>
  );
}
