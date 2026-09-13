import type { Metadata } from "next";

import { WayFilm } from "@/components/content/WayFilm";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";
import { WAY } from "@/lib/content";

export const metadata: Metadata = {
  title: "멈춘자가 만든 전환",
  description: WAY.title,
};

export default async function WayPage() {
  await assertPublicHref("/way");
  const { pages } = await getContent();
  return <WayFilm page={pages.way} />;
}
