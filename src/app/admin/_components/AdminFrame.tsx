"use client";

import { useState } from "react";

import { logout } from "@/app/admin/actions";

import { AdminNav } from "./AdminNav";
import type { AdminCounts } from "./counts";

export function AdminFrame({
  title,
  subtitle,
  wide,
  counts,
  children,
}: {
  title: string;
  subtitle?: string;
  wide?: boolean;
  counts: AdminCounts;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-ink-05">
      {open ? (
        <button
          type="button"
          aria-label="메뉴 닫기"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        data-open={open ? "true" : "false"}
        className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-forest text-white max-md:data-[open=false]:-translate-x-full md:static md:z-0"
      >
        <div className="flex h-14 shrink-0 items-center px-5">
          <p className="serif text-[22px] leading-none text-white">멈춘자</p>
          <p className="adm-meta ml-2 tracking-[0.16em] text-forest-30">Admin</p>
        </div>
        <AdminNav counts={counts} onNavigate={() => setOpen(false)} />
        <form action={logout} className="shrink-0 border-t border-forest-80 p-3">
          <button
            type="submit"
            className="adm-body w-full rounded-[4px] px-3 py-2 text-left text-forest-10 hover:bg-forest-90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
          >
            로그아웃
          </button>
        </form>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-ink-15 bg-white px-4 md:hidden">
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="adm-body grid size-10 place-items-center rounded-[4px] text-forest hover:bg-ink-05"
          >
            메뉴
          </button>
          <div className="min-w-0">
            <p className="adm-h truncate text-forest">{title}</p>
            {subtitle ? <p className="adm-meta truncate text-ink-70">{subtitle}</p> : null}
          </div>
        </header>
        <main className={wide ? "flex-1 px-6 py-6 pb-28" : "mx-auto w-full max-w-[880px] flex-1 px-6 py-6 pb-28"}>
          <h1 className="adm-title hidden text-forest md:block">{title}</h1>
          {subtitle ? <p className="adm-body mt-1 hidden text-ink-70 md:block">{subtitle}</p> : null}
          <div className="md:mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
