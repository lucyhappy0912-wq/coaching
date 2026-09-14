import type { Metadata } from "next";

import { FounderTransition } from "@/components/content/FounderTransition";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";
import { FOUNDER_TRANSITION } from "@/lib/founder-transition";

export const metadata: Metadata = {
  title: "Founder Transition",
  description: FOUNDER_TRANSITION.hero.body[0],
};

export default async function FounderTransitionPage() {
  await assertPublicHref("/coaching/founder-transition");
  const { pages } = await getContent();
  return <FounderTransition hero={pages.founder.hero} split={pages.founder.split} />;
}
