"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "홈" },
  { href: "/admin/site", label: "사이트" },
  { href: "/admin/posts", label: "소식" },
  { href: "/admin/checks", label: "문답" },
  { href: "/admin/members", label: "회원" },
];

export function AdminNav({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const pathname = usePathname();
  return (
    <nav
      className={
        orientation === "horizontal"
          ? "flex gap-1 overflow-x-auto px-3 py-2"
          : "flex flex-col gap-0.5 px-3"
      }
    >
      {NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "adm-body shrink-0 rounded-[4px] px-3 py-2",
              "focus-visible:outline-2 focus-visible:outline-offset-1",
              orientation === "horizontal"
                ? active
                  ? "bg-forest text-white focus-visible:outline-forest"
                  : "text-forest hover:bg-ink-05 focus-visible:outline-forest"
                : active
                  ? "bg-white text-forest focus-visible:outline-white"
                  : "text-forest-10 hover:bg-forest-90 hover:text-white focus-visible:outline-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
