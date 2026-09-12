"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, Search, X } from "lucide-react";

import type { CmsSite } from "@/lib/cms/types";
import { MENU_GROUPS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header({ site = SITE }: { site?: CmsSite }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const onHome = pathname === "/";
  const overlayHero = onHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 40);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // 히어로 위에서는 흰 글자, 스크롤하거나 메뉴를 열면 흰 배경 + 딥그린 글자
  const solid = !overlayHero || scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-(--header-h) transition-colors duration-300",
        solid ? "bg-white/95 text-forest backdrop-blur" : "bg-transparent text-white"
      )}
    >
      <div className="relative flex h-full items-center justify-between px-(--gutter)">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="serif leading-none tracking-tight"
        >
          <span className="block text-[16px] sm:text-[18px] lg:text-[22px]">멈춘자</span>
          <span className="mt-1 block text-[10px] tracking-[0.02em] opacity-80 sm:text-[11px] lg:text-[12px]">
            your transition partner
          </span>
        </Link>

        <nav className="serif absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-[22px] lg:flex">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="transition-opacity hover:opacity-60"
          >
            Menu
          </button>
          <Link href="/coaching" className="transition-opacity hover:opacity-60">
            Coaching
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${site.phone.replace(/-/g, "")}`}
            aria-label="전화 문의"
            className="transition-opacity hover:opacity-60"
          >
            <Phone className="size-[18px]" strokeWidth={1.4} />
          </a>
          <button type="button" aria-label="검색" className="transition-opacity hover:opacity-60">
            <Search className="size-[18px]" strokeWidth={1.4} />
          </button>
          <Link href="/consult" className="serif text-[20px] leading-none lg:text-[26px]">
            Consult
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            className="serif text-[20px] leading-none lg:hidden"
          >
            {menuOpen ? <X className="size-5" strokeWidth={1.4} /> : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="max-h-[calc(100vh-var(--header-h))] overflow-y-auto border-t border-ink-10 bg-white text-forest">
          <div className="grid gap-10 px-(--gutter) py-10 lg:grid-cols-3 lg:gap-16 lg:py-14">
            {MENU_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="c1 mb-5 tracking-[0.2em] text-stem uppercase">{group.title}</p>
                <ul className="space-y-3.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      {item.href.startsWith("tel:") || item.href.startsWith("mailto:") ? (
                        <a
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="serif text-[22px] leading-none transition-opacity hover:opacity-50 lg:text-[26px]"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="serif text-[22px] leading-none transition-opacity hover:opacity-50 lg:text-[26px]"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-ink-10 px-(--gutter) py-6">
            <p className="b3 text-ink-70">
              {site.hours} · {site.phone}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
