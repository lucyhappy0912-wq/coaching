import type { Metadata } from "next";

import { NextLeadership } from "@/components/content/NextLeadership";
import { getContent } from "@/lib/cms/store";
import { FOUNDER_PROGRAM } from "@/lib/content";

export const metadata: Metadata = {
  title: "Your Next Leadership",
  description: FOUNDER_PROGRAM.next.line,
};

export default async function LeadershipPage() {
  const { pages } = await getContent();
  return <NextLeadership page={pages.leadership} />;
}
