import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getContent } from "@/lib/cms/store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <div className="flex min-h-svh flex-col">
      <Header site={content.site} menuOff={content.menuOff} />
      <main className="flex-1">{children}</main>
      <Footer site={content.site} menuOff={content.menuOff} />
    </div>
  );
}
