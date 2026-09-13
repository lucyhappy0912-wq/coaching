import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { cmsWritable } from "@/lib/cms/client";
import { getContent } from "@/lib/cms/store";

import { PageCards } from "./PageCards";

export const dynamic = "force-dynamic";

export default async function AdminPagesIndex() {
  await requireAdmin();
  const content = await getContent();

  return (
    <AdminShell title="페이지" subtitle="사진·영상·글을 페이지마다 고칩니다">
      <p className="adm-body text-ink-70">
        카드 왼쪽은 글을 고치는 화면입니다. 오른쪽 눈을 누르면 그 페이지가 사이트 메뉴에서 빠지고,
        주소로 들어와도 열리지 않습니다. 다시 누르면 공개됩니다.
      </p>
      <PageCards menuOff={content.menuOff} menuOn={content.menuOn} canSave={cmsWritable()} />
    </AdminShell>
  );
}
