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
        큰 제목은 사이트 메뉴 이름입니다. 아래 작은 제목으로 어떤 페이지인지 고릅니다. 눈 아이콘을
        누르면 메뉴에 보일지 바로 바뀝니다.
      </p>
      <PageCards menuOff={content.menuOff} menuOn={content.menuOn} canSave={cmsWritable()} />
    </AdminShell>
  );
}
