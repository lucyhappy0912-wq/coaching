import { AdminShell } from "@/app/admin/_components/AdminShell";
import { FaqEditor } from "@/app/admin/_components/FaqEditor";
import { requireAdmin } from "@/lib/auth/dal";
import { cmsWritable } from "@/lib/cms/client";
import { getContent } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  await requireAdmin();
  const content = await getContent();
  return (
    <AdminShell title="자주 묻는 질문">
      <p className="adm-body mb-6 text-ink-70">사이트 FAQ 페이지에 그대로 나갑니다.</p>
      <FaqEditor initial={content.faqs} canSave={cmsWritable()} />
    </AdminShell>
  );
}
