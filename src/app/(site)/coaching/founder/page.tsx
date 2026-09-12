import type { Metadata } from "next";

import { FounderLedger } from "@/components/content/FounderLedger";
import { getContent } from "@/lib/cms/store";
import { FOUNDER_PROGRAM } from "@/lib/content";

export const metadata: Metadata = {
  title: "Founder Transition",
  description: FOUNDER_PROGRAM.lead,
};

export default async function FounderPage() {
  const { pages } = await getContent();
  return <FounderLedger page={pages.founder} />;
}
