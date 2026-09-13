import "server-only";

import { notFound } from "next/navigation";

import { isMenuHrefOn } from "@/lib/menu";

import { getContent } from "./store";

export async function assertPublicHref(href: string) {
  const { menuOff, menuOn } = await getContent();
  if (!isMenuHrefOn(href, menuOff, menuOn)) notFound();
}
