import { Cormorant, Mulish, Noto_Sans_KR } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getContent } from "@/lib/cms/store";
import { visibleMenuGroups } from "@/lib/menu";

export const revalidate = 300;

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const groups = visibleMenuGroups(content.menuOff, content.menuOn);
  return (
    <div
      className={`${cormorant.variable} ${mulish.variable} ${notoSansKr.variable} flex min-h-svh flex-col`}
    >
      <Header site={content.site} groups={groups} />
      <main className="flex-1">{children}</main>
      <Footer site={content.site} menuOff={content.menuOff} menuOn={content.menuOn} />
    </div>
  );
}
