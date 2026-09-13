import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getContent } from "@/lib/cms/store";
import { visibleMenuGroups } from "@/lib/menu";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const groups = visibleMenuGroups(content.menuOff, content.menuOn);
  return (
    <div className="flex min-h-svh flex-col">
      <Header site={content.site} groups={groups} />
      <main className="flex-1">{children}</main>
      <Footer site={content.site} menuOff={content.menuOff} menuOn={content.menuOn} />
    </div>
  );
}
