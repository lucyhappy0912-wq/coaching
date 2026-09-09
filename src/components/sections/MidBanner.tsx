import { PillButton } from "@/components/ui/Buttons";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { MID_BANNER } from "@/lib/site";

// 높이는 min-h 로만 잡는다. 고정 높이 + overflow-hidden 조합이면
// 본문이 길어지거나 타이포 스케일이 올라갈 때 글자가 잘린다.
export function MidBanner() {
  return (
    <section className="relative flex min-h-[380px] items-center overflow-hidden py-16 lg:min-h-[520px]">
      <div className="absolute inset-0">
        <Photo src={MID_BANNER.image} tone={MID_BANNER.tone} alt={MID_BANNER.title} />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <Container className="relative w-full text-white lg:flex lg:items-center lg:gap-3">
        <div className="lg:w-[calc(50%-6px)]">
          <h2 className="t2">{MID_BANNER.title}</h2>
          <PillButton href={MID_BANNER.cta.href} variant="white" size="small" className="mt-6">
            {MID_BANNER.cta.label}
          </PillButton>
        </div>
        <p className="b3 mt-8 max-w-md leading-relaxed opacity-90 lg:mt-0 lg:w-[calc(50%-6px)]">
          {MID_BANNER.body}
        </p>
      </Container>
    </section>
  );
}
