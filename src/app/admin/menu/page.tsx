import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { cmsWritable } from "@/lib/cms/client";
import { getContent } from "@/lib/cms/store";

import { MenuForm } from "./MenuForm";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  await requireAdmin();
  const content = await getContent();

  return (
    <AdminShell title="메뉴">
      <p className="adm-body mb-6 text-ink-70">
        사이트 상단 메뉴에 어떤 페이지를 보여줄지 정합니다. Next Chapter, Founder, Leadership은
        기본으로 꺼 두었습니다.
      </p>
      <MenuForm initialOff={content.menuOff} initialOn={content.menuOn} canSave={cmsWritable()} />
    </AdminShell>
  );
}
