import { AdminShell } from "@/app/admin/_components/AdminShell";
import { FaqEditor } from "@/app/admin/_components/FaqEditor";
import { requireAdmin } from "@/lib/auth/dal";
import { cmsFailMessage, cmsWritable } from "@/lib/cms/client";
import { readContentForWrite } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  await requireAdmin();
  try {
    const content = await readContentForWrite();
    return (
      <AdminShell title="자주 묻는 질문">
        <p className="adm-body mb-6 text-ink-70">사이트 FAQ 페이지에 그대로 나갑니다.</p>
        <FaqEditor initial={content.faqs} canSave={cmsWritable()} />
      </AdminShell>
    );
  } catch (error) {
    return (
      <AdminShell title="자주 묻는 질문">
        <p className="adm-body text-danger">{cmsFailMessage(error)}</p>
      </AdminShell>
    );
  }
}
