import { PillButton } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import { MID_BANNER } from "@/lib/site";

export function MidBanner() {
  return (
    <section className="relative h-[380px] overflow-hidden lg:h-[520px]">
      <Photo src={MID_BANNER.image} tone={MID_BANNER.tone} alt={MID_BANNER.title} />
      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-x-(--gutter) top-1/2 -translate-y-1/2 text-white lg:flex lg:items-center lg:gap-3">
        <div className="lg:w-[calc(50%-6px)]">
          <h2 className="t2">{MID_BANNER.title}</h2>
          <PillButton href={MID_BANNER.cta.href} variant="white" size="small" className="mt-6">
            {MID_BANNER.cta.label}
          </PillButton>
        </div>
        <p className="b3 mt-8 max-w-md leading-relaxed opacity-90 lg:mt-0 lg:w-[calc(50%-6px)]">
          {MID_BANNER.body}
        </p>
      </div>
    </section>
  );
}
