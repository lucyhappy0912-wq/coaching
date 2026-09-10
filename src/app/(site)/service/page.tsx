import type { Metadata } from "next";

import { SectionPage } from "@/components/layout/PageFrame";
import { Services } from "@/components/sections/Services";

export const metadata: Metadata = {
  title: "Service",
  description: "무료 상담, 세션 기록, 그룹 세션, 이후 관리.",
};

export default function ServicePage() {
  return (
    <SectionPage>
      <Services />
    </SectionPage>
  );
}
