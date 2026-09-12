import { logout } from "@/app/admin/actions";

import { AdminNav } from "./AdminNav";

export function AdminShell({
  title,
  wide = false,
  children,
}: {
  title: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-ink-05 lg:flex-row">
      <aside className="hidden w-[220px] shrink-0 flex-col bg-forest text-white lg:flex">
        <div className="px-6 py-5">
          <p className="serif text-[22px] leading-none">coaching</p>
          <p className="adm-meta mt-1 uppercase tracking-[0.18em] text-forest-30">Admin</p>
        </div>
        <AdminNav />
        <form action={logout} className="mt-auto px-3 pb-5">
          <button
            type="submit"
            className="adm-body w-full rounded-[4px] px-3 py-2 text-left text-forest-10 hover:bg-forest-90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
          >
            로그아웃
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-ink-15 bg-white lg:hidden">
          <p className="serif px-4 py-3 text-[20px] text-forest">coaching</p>
          <form action={logout} className="pr-3">
            <button type="submit" className="adm-body px-2 py-2 text-forest">
              로그아웃
            </button>
          </form>
        </header>
        <div className="border-b border-ink-15 bg-white lg:hidden">
          <AdminNav orientation="horizontal" />
        </div>
        <main className={wide ? "px-6 py-6 pb-28" : "mx-auto w-full max-w-[960px] px-6 py-6 pb-28"}>
          <h1 className="adm-title text-forest">{title}</h1>
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
