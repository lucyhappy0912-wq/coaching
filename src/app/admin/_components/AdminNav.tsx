"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import type { AdminCounts } from "./counts";

const GROUPS = [
  {
    label: "운영",
    items: [
      { href: "/admin/inquiries", label: "상담 신청", countKey: "newLeads" as const },
      { href: "/admin/board", label: "질문 게시판", countKey: "unanswered" as const },
      { href: "/admin/faq", label: "자주 묻는 질문" },
      { href: "/admin/checks", label: "문답" },
      { href: "/admin/members", label: "회원" },
    ],
  },
  {
    label: "콘텐츠",
    items: [
      { href: "/admin/pages", label: "페이지" },
      { href: "/admin/posts", label: "소식" },
    ],
  },
  {
    label: "설정",
    items: [
      { href: "/admin/site", label: "사이트 정보" },
      { href: "/admin/menu", label: "메뉴" },
    ],
  },
];

export function AdminNav({
  counts,
  onNavigate,
}: {
  counts?: AdminCounts;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [current, setCurrent] = useState("");
  useEffect(() => {
    setCurrent(pathname);
  }, [pathname]);
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 pb-4">
      <Link
        href="/admin"
        onClick={onNavigate}
        aria-current={current === "/admin" ? "page" : undefined}
        className={cn(
          "adm-body rounded-[4px] px-3 py-2",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white",
          current === "/admin"
            ? "bg-white text-forest"
            : "text-forest-10 hover:bg-forest-90 hover:text-white",
        )}
      >
        대시보드
      </Link>
      {GROUPS.map((group) => (
        <div key={group.label}>
          <p className="adm-meta mb-1.5 px-3 tracking-[0.16em] text-forest-50">{group.label}</p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = current === item.href || current.startsWith(`${item.href}/`);
              const count = item.countKey ? counts?.[item.countKey] ?? 0 : 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "adm-body flex items-center justify-between rounded-[4px] px-3 py-2",
                    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white",
                    active ? "bg-white text-forest" : "text-forest-10 hover:bg-forest-90 hover:text-white",
                  )}
                >
                  <span>{item.label}</span>
                  {count > 0 ? (
                    <span className="adm-meta min-w-5 rounded-full bg-grass px-1.5 text-center text-forest">
                      {count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
