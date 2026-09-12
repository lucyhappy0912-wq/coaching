import type { Metadata } from "next";
import { Cormorant, Mulish, Noto_Sans_KR } from "next/font/google";

import { SITE } from "@/lib/site";
import "./globals.css";

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
  weight: ["400", "500", "700"],
  display: "swap",
});

const SHARE_TITLE = "멈춘자 | 스타트업 창업자를 리더로.";

export const metadata: Metadata = {
  title: {
    default: SHARE_TITLE,
    template: "%s | 멈춘자",
  },
  description: SITE.description,
  openGraph: {
    title: SHARE_TITLE,
    description: SITE.description,
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: SHARE_TITLE,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${cormorant.variable} ${mulish.variable} ${notoSansKr.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
