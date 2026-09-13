import type { Metadata } from "next";

import { FounderLedger } from "@/components/content/FounderLedger";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";
import { FOUNDER_PROGRAM } from "@/lib/content";

export const metadata: Metadata = {
  title: "Founder Transition",
  description: FOUNDER_PROGRAM.lead,
};

export default async function FounderPage() {
  await assertPublicHref("/coaching/founder");
  const { pages } = await getContent();
  return <FounderLedger page={pages.founder} />;
}
