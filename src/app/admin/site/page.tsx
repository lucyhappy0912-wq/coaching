import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { cmsEnabled } from "@/lib/cms/client";
import { getContent } from "@/lib/cms/store";

import { SiteForms } from "./SiteForms";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  await requireAdmin();
  const content = await getContent();

  return (
    <AdminShell title="사이트">
      <SiteForms
        site={content.site}
        topMessages={content.topMessages}
        coach={content.coach}
        faqs={content.faqs}
        canSave={cmsEnabled()}
      />
    </AdminShell>
  );
}
