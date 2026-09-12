import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";

export const dynamic = "force-dynamic";

const CARDS = [
  { href: "/admin/content", title: "콘텐츠", body: "연락처, 히어로, 코치, FAQ 문구를 바꿉니다." },
  { href: "/admin/media", title: "이미지", body: "사진을 올리고 주소만 콘텐츠에 붙입니다." },
  { href: "/admin/posts", title: "게시판", body: "소식을 쓰고 사이트에 발행합니다." },
  { href: "/admin/members", title: "회원", body: "문답 제출자와 직접 등록한 연락처를 봅니다." },
  { href: "/admin/checks", title: "문답표", body: "21문항 답과 분석지를 엽니다." },
];

export default async function AdminHomePage() {
  await requireAdmin();
  return (
    <AdminShell title="관리">
      <ul className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="block rounded-[6px] border border-ink-15 bg-white p-5 hover:border-forest-30"
            >
              <p className="adm-h text-forest">{card.title}</p>
              <p className="adm-body mt-2 text-ink-70">{card.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
