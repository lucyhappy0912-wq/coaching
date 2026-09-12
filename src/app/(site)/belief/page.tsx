import type { Metadata } from "next";

import { BeliefCreed } from "@/components/content/BeliefCreed";
import { getContent } from "@/lib/cms/store";
import { BELIEF_CLOSE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Belief",
  description: BELIEF_CLOSE.line,
};

export default async function BeliefPage() {
  const { pages } = await getContent();
  return <BeliefCreed page={pages.belief} />;
}
