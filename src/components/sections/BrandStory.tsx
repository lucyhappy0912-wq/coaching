import { LinedLink } from "@/components/ui/Buttons";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { BRAND_STORY, SITE } from "@/lib/site";

export function BrandStory() {
  return (
    <section className="relative flex min-h-[350px] items-center overflow-hidden py-16 lg:min-h-[450px]">
      <div className="absolute inset-0">
        <Photo src={BRAND_STORY.image} tone="forest" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <Container className="relative flex w-full flex-col items-center text-center text-white">
        <p className="serif text-[32px] leading-none lg:text-[44px]">{SITE.name}</p>
        <p className="b3 mt-4 max-w-md opacity-90">{BRAND_STORY.tagline}</p>
        <LinedLink href={BRAND_STORY.link.href} className="mt-8">
          {BRAND_STORY.link.label}
        </LinedLink>
      </Container>
    </section>
  );
}
