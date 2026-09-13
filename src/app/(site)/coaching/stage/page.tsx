import type { Metadata } from "next";

import { StageJournal } from "@/components/content/StageJournal";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";
import { STAGE_PROGRAM } from "@/lib/content";

export const metadata: Metadata = {
  title: "Stage Transition",
  description: STAGE_PROGRAM.lead,
};

export default async function StagePage() {
  await assertPublicHref("/coaching/stage");
  const { pages } = await getContent();
  return <StageJournal page={pages.stage} />;
}
