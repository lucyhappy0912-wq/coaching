import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBanner } from "@/components/layout/TopBanner";
import { getContent } from "@/lib/cms/store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <div className="flex min-h-svh flex-col">
      <TopBanner messages={content.topMessages} />
      <Header site={content.site} />
      <main className="flex-1 pt-(--banner-h)">{children}</main>
      <Footer site={content.site} />
    </div>
  );
}
