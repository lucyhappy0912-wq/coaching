import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBanner } from "@/components/layout/TopBanner";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <TopBanner />
      <Header />
      <main className="flex-1 pt-(--banner-h)">{children}</main>
      <Footer />
    </div>
  );
}
