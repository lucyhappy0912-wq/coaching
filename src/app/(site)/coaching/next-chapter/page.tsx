import type { Metadata } from "next";

import { ChapterHorizon } from "@/components/content/ChapterHorizon";
import { getContent } from "@/lib/cms/store";
import { NEXT_CHAPTER_PROGRAM } from "@/lib/content";

export const metadata: Metadata = {
  title: "Next Chapter Transition",
  description: NEXT_CHAPTER_PROGRAM.lead,
};

export default async function NextChapterPage() {
  const { pages } = await getContent();
  return <ChapterHorizon page={pages.nextChapter} />;
}
