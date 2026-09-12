import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { formatPhoneDisplay } from "@/lib/check/mask";
import { getLeadForAdmin } from "@/lib/leads/store";

import { deleteLead, updateLeadStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminInquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const row = await getLeadForAdmin(id);
  if (!row) notFound();

  return (
    <AdminShell title="상담 신청">
      <Link href="/admin/inquiries" className="adm-body text-forest hover:underline">
        목록으로
      </Link>
      <section className="mt-6 rounded-[6px] border border-ink-15 bg-white p-5">
        <dl className="space-y-4">
          <Item label="이름">{row.name}</Item>
          <Item label="연락처">{formatPhoneDisplay(row.phone)}</Item>
          <Item label="희망 시간">{row.preferredTime || "없음"}</Item>
          <Item label="고민">{row.message || "없음"}</Item>
          <Item label="접수">{row.receivedAt.slice(0, 16).replace("T", " ")}</Item>
        </dl>
        <form action={updateLeadStatus} className="mt-6 flex flex-wrap gap-2">
          <input type="hidden" name="id" value={row.id} />
          <button name="status" value="new" className="adm-body h-10 rounded-[4px] border border-ink-50 px-4 text-forest">
            신규
          </button>
          <button name="status" value="contacted" className="adm-body h-10 rounded-[4px] border border-ink-50 px-4 text-forest">
            연락함
          </button>
          <button name="status" value="closed" className="adm-body h-10 rounded-[4px] bg-forest px-4 text-white">
            종료
          </button>
        </form>
        <form action={deleteLead} className="mt-4">
          <input type="hidden" name="id" value={row.id} />
          <button type="submit" className="adm-body text-danger hover:underline">
            이 신청 삭제
          </button>
        </form>
      </section>
    </AdminShell>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="adm-label text-forest-70">{label}</dt>
      <dd className="adm-body mt-1 whitespace-pre-wrap text-ink-90">{children}</dd>
    </div>
  );
}
