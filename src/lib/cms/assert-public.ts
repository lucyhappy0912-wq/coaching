import "server-only";

import { notFound } from "next/navigation";

import { getContent } from "./store";

export async function assertPublicHref(href: string) {
  const { menuOff } = await getContent();
  if (menuOff.includes(href)) notFound();
}
