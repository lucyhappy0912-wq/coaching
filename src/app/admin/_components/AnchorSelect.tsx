"use client";

import { ADM_INPUT } from "./fields";

export const PAGE_LINKS = [
  { href: "/consult", label: "상담 신청" },
  { href: "/coaching", label: "코칭 안내" },
  { href: "/coaching/stage", label: "Stage Transition" },
  { href: "/coaching/founder", label: "Founder Transition" },
  { href: "/way", label: "멈춘자 way" },
  { href: "/check", label: "문답표" },
  { href: "/board", label: "Q&A 게시판" },
  { href: "/faq", label: "자주 묻는 질문" },
  { href: "/coach", label: "코치 소개" },
] as const;

export function AnchorSelect({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (href: string) => void;
}) {
  const safe = PAGE_LINKS.some((item) => item.href === value) ? value : "/consult";
  return (
    <label className="block">
      <span className="adm-label mb-1.5 block text-forest-70">버튼이 가는 곳</span>
      <select
        name={name}
        value={safe}
        onChange={(event) => onChange(event.target.value)}
        className={ADM_INPUT}
      >
        {PAGE_LINKS.map((item) => (
          <option key={item.href} value={item.href}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
