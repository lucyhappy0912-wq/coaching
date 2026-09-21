import type { Metadata } from "next";

import { SITE } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const SHARE_TITLE = "멈춘자 | 스타트업 창업자를 리더로.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: SHARE_TITLE,
    template: "%s | 멈춘자",
  },
  description: SITE.description,
  openGraph: {
    title: "멈춘자",
    description: SITE.description,
    url: "/",
    siteName: "멈춘자",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "멈춘자",
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
