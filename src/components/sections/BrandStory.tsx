import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import { BRAND_STORY, SITE } from "@/lib/site";

export function BrandStory() {
  return (
    <section className="relative h-[350px] overflow-hidden lg:h-[450px]">
      <Photo src={BRAND_STORY.image} tone="forest" />
      <div className="absolute inset-0 bg-black/25" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-(--gutter) text-center text-white">
        <p className="serif text-[32px] leading-none lg:text-[44px]">{SITE.name}</p>
        <p className="b3 mt-4 max-w-md opacity-90">{BRAND_STORY.tagline}</p>
        <LinedLink href={BRAND_STORY.link.href} className="mt-8">
          {BRAND_STORY.link.label}
        </LinedLink>
      </div>
    </section>
  );
}
