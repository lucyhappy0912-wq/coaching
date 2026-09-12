import type { Metadata } from "next";

import { StoryFilm } from "@/components/content/StoryFilm";
import { getContent } from "@/lib/cms/store";
import { BRAND_WHY } from "@/lib/content";

export const metadata: Metadata = {
  title: "왜멈춘자인가",
  description: BRAND_WHY.lead,
};

export default async function StoryPage() {
  const { pages } = await getContent();
  return <StoryFilm slides={pages.story.slides} />;
}
