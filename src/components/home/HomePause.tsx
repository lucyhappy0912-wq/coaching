import { Photo } from "@/components/ui/Photo";
import { HOME_VISUAL } from "@/lib/visual";

export function HomePause() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-(--gutter) py-24 lg:py-36">
        <p className="c1 tracking-[0.22em] text-ink-50 uppercase">PAUSE</p>
        <p className="serif mt-8 max-w-3xl text-[28px] leading-[1.25] text-ink lg:text-[44px]">
          계속 가는 것이 항상 답은 아닙니다.
        </p>
        <div className="relative mt-16 aspect-[16/7] overflow-hidden lg:mt-24">
          <Photo
            src={HOME_VISUAL.pause}
            alt=""
            tone="paper"
            className="absolute inset-0"
            sizes="(min-width: 1025px) 64rem, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
