import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LinedLink, PillButton } from "@/components/ui/Buttons";
import { PageFrame } from "@/components/layout/PageFrame";
import { Photo } from "@/components/ui/Photo";
import { AUDIENCES } from "@/lib/site";

const SLUG_TO_ID = {
  adult: "adult",
  senior: "senior",
  leadership: "leader",
} as const;

type Slug = keyof typeof SLUG_TO_ID;

function audienceOf(slug: string) {
  if (!(slug in SLUG_TO_ID)) return null;
  const id = SLUG_TO_ID[slug as Slug];
  return AUDIENCES.find((item) => item.id === id) ?? null;
}

export function generateStaticParams() {
  return Object.keys(SLUG_TO_ID).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = audienceOf(id);
  if (!item) return {};
  return { title: item.label, description: item.body };
}

export default async function CoachingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = audienceOf(id);
  if (!item) notFound();

  return (
    <PageFrame>
      <p className="c1 tracking-[0.16em] text-forest-70 uppercase">{item.label}</p>
      <h1 className="serif mt-3 text-[28px] leading-tight sm:text-[40px]">{item.title}</h1>
      <div className="relative mt-8 aspect-4/3 overflow-hidden">
        <Photo src={item.image} tone={item.tone} alt={item.title} sizes="(min-width: 1025px) 48vw, 100vw" />
      </div>
      <p className="b2 mt-8 text-ink-90">{item.body}</p>
      <div className="mt-10 flex flex-col gap-4">
        <PillButton href={item.link.href}>{item.link.label}</PillButton>
        <LinedLink href="/coaching">다른 코칭 보기</LinedLink>
      </div>
    </PageFrame>
  );
}
