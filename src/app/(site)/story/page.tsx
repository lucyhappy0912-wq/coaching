import type { Metadata } from "next";

import { StoryFilm } from "@/components/content/StoryFilm";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";
import { BRAND_WHY } from "@/lib/content";

export const metadata: Metadata = {
  title: "How we transition",
  description: BRAND_WHY.lead,
};

export default async function StoryPage() {
  await assertPublicHref("/story");
  const { pages } = await getContent();
  return <StoryFilm slides={pages.story.slides} />;
}
