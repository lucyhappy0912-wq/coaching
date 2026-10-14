import { PageHero } from "@/components/content/PageHero";
import { LinedLink } from "@/components/ui/Buttons";

export function ServiceOffer({
  eyebrow,
  title,
  lead,
  image,
  objectPosition = "center",
  href = "/consult",
  cta = "상담 신청",
}: {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  objectPosition?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="bg-[#f7f6f3]">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        image={image}
        objectPosition={objectPosition}
        compact
      />
      <section className="px-(--gutter) py-16 lg:py-24">
        <LinedLink href={href} className="text-forest">
          {cta}
        </LinedLink>
      </section>
    </div>
  );
}
