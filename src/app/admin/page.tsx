import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { listQuestionsForAdmin } from "@/lib/board/store";
import { maskName, maskPhone } from "@/lib/check/mask";
import { listChecksForAdmin } from "@/lib/check/store";
import { PAGE_META } from "@/lib/cms/page-keys";
import { getContent } from "@/lib/cms/store";
import { listLeadsForAdmin } from "@/lib/leads/store";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  new: "신규",
  contacted: "연락함",
  closed: "종료",
};

export default async function AdminHomePage() {
  await requireAdmin();
  const [leads, questions, checks, content] = await Promise.all([
    listLeadsForAdmin(),
    listQuestionsForAdmin(),
    listChecksForAdmin(),
    getContent(),
  ]);

  const newLeads = leads.filter((row) => row.status === "new");
  const unanswered = questions.filter((row) => !row.answer);
  const faqs = content.faqs.filter((item) => item.q && item.a);

  return (
    <AdminShell title="대시보드">
      <p className="adm-body text-ink-70">오늘 확인할 일과 최근 신청입니다.</p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        <Stat href="/admin/inquiries" label="신규 상담" value={newLeads.length} hint="연락이 필요한 신청" />
        <Stat href="/admin/board" label="미답변 질문" value={unanswered.length} hint="게시판에 올라온 질문" />
        <Stat href="/admin/faq" label="자주 묻는 질문" value={faqs.length} hint="사이트 FAQ에 나가는 칸" />
        <Stat href="/admin/checks" label="문답" value={checks.length} hint="진단 응답" />
      </ul>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Recent title="최근 상담 신청" href="/admin/inquiries" empty="아직 신청이 없습니다.">
          {leads.slice(0, 5).map((row) => (
            <Link
              key={row.id}
              href={`/admin/inquiries/${row.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-ink-05"
            >
              <span>
                <span className="adm-body block text-forest">{maskName(row.name)}</span>
                <span className="adm-meta mt-0.5 block text-ink-70">
                  {maskPhone(row.phone)} · {row.receivedAt.slice(0, 10)}
                </span>
              </span>
              <span className="adm-meta shrink-0 text-ink-70">{STATUS[row.status] ?? row.status}</span>
            </Link>
          ))}
        </Recent>

        <Recent title="최근 질문" href="/admin/board" empty="아직 질문이 없습니다.">
          {questions.slice(0, 5).map((row) => (
            <Link
              key={row.id}
              href={`/admin/board/${row.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-ink-05"
            >
              <span>
                <span className="adm-body block text-forest">{row.title}</span>
                <span className="adm-meta mt-0.5 block text-ink-70">
                  {row.name} · {row.createdAt.slice(0, 10)}
                </span>
              </span>
              <span className="adm-meta shrink-0 text-ink-70">
                {row.published ? "공개" : row.answer ? "답변 있음" : "대기"}
              </span>
            </Link>
          ))}
        </Recent>
      </section>

      <section className="mt-8">
        <p className="adm-meta uppercase tracking-[0.16em] text-ink-70">페이지</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {PAGE_META.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/admin/pages/${item.slug}`}
                className="block rounded-[6px] border border-ink-15 bg-white px-4 py-3 text-forest hover:bg-ink-05"
              >
                <p className="adm-body">{item.title}</p>
                <p className="adm-meta mt-1 text-ink-70">{item.preview}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AdminShell>
  );
}

function Stat({
  href,
  label,
  value,
  hint,
}: {
  href: string;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <li>
      <Link href={href} className="block rounded-[6px] border border-ink-15 bg-white px-4 py-4 hover:bg-ink-05">
        <p className="adm-meta text-ink-70">{label}</p>
        <p className="adm-title mt-2 text-forest">{value}</p>
        <p className="adm-meta mt-1 text-ink-70">{hint}</p>
      </Link>
    </li>
  );
}

function Recent({
  title,
  href,
  empty,
  children,
}: {
  title: string;
  href: string;
  empty: string;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className="overflow-hidden rounded-[6px] border border-ink-15 bg-white">
      <div className="flex items-center justify-between border-b border-ink-10 px-4 py-3">
        <p className="adm-h text-forest">{title}</p>
        <Link href={href} className="adm-meta text-forest hover:underline">
          전체
        </Link>
      </div>
      {items.filter(Boolean).length === 0 ? (
        <p className="adm-body px-4 py-5 text-ink-70">{empty}</p>
      ) : (
        <div className="divide-y divide-ink-10">{children}</div>
      )}
    </div>
  );
}
