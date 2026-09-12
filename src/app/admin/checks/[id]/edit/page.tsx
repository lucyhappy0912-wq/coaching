import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminCheckEditForm } from "@/app/admin/checks/AdminCheckEditForm";
import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { getCheckForAdmin } from "@/lib/check/store";

export const dynamic = "force-dynamic";

export default async function AdminCheckEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const found = await getCheckForAdmin(id);
  if (!found) notFound();

  const { record } = found;

  return (
    <AdminShell title="문답 · 수정">
      <p className="adm-body mb-6">
        <Link href={`/admin/checks/${id}`} className="text-forest underline-offset-2 hover:underline">
          상세로
        </Link>
      </p>
      <p className="adm-body text-ink-70">
        이름·연락처·문항 답을 고칩니다. 총점과 분석지는 저장한 답으로 다시 계산됩니다. 결과 주소와
        보관 기간은 그대로입니다.
      </p>
      <AdminCheckEditForm
        id={record.id}
        name={record.identity.name}
        phone={record.identity.phone}
        email={record.identity.email}
        industry={record.identity.industry}
        founderJourney={record.identity.founderJourney}
        contactConsent={record.identity.contactConsent}
        answers={record.answers}
      />
    </AdminShell>
  );
}
