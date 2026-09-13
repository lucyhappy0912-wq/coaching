import type { Metadata } from "next";

import { BeliefCreed } from "@/components/content/BeliefCreed";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";
import { BELIEF_CLOSE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Belief",
  description: BELIEF_CLOSE.line,
};

export default async function BeliefPage() {
  await assertPublicHref("/belief");
  const { pages } = await getContent();
  return <BeliefCreed page={pages.belief} />;
}
