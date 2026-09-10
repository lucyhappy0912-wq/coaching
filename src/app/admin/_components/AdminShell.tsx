import { logout } from "@/app/admin/actions";

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-ink-05">
      <header className="flex h-14 items-center justify-between border-b border-ink-15 bg-forest px-6">
        <div className="flex items-center gap-2">
          <span className="serif text-[22px] leading-none text-white">coaching</span>
          <span className="adm-meta uppercase tracking-[0.18em] text-forest-30">Admin</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="adm-body rounded-[4px] px-3 py-2 text-forest-10 hover:bg-forest-90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
          >
            로그아웃
          </button>
        </form>
      </header>
      <main className="mx-auto w-full max-w-[880px] flex-1 px-6 py-6">
        <h1 className="adm-title text-forest">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
