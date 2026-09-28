import { LinedLink } from "@/components/ui/Buttons";

export function HomeClose() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex min-h-[70svh] max-w-5xl flex-col justify-center px-(--gutter) py-28 lg:min-h-[80svh] lg:py-36">
        <p className="c1 tracking-[0.22em] text-ink-50 uppercase">Closing</p>
        <p className="serif mt-8 text-[36px] leading-[1.05] tracking-[-0.03em] text-ink lg:text-[64px]">
          WHAT’S YOUR NEXT?
        </p>
        <p className="serif mt-6 text-[20px] tracking-[0.12em] text-ink-70">
          PAUSE. TRANSITION. NEXT.
        </p>
        <LinedLink href="/consult" className="mt-12 text-forest">
          상담 신청
        </LinedLink>
      </div>
    </section>
  );
}
