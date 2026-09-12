"use client";

import { useActionState } from "react";

import { login, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export function AdminLoginForm({ changed }: { changed?: boolean }) {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <div className="flex min-h-svh items-center justify-center bg-ink-05 px-6">
      <form action={action} className="w-full max-w-sm rounded-[6px] border border-ink-15 bg-white p-6">
        <p className="serif text-[22px] text-forest">coaching</p>
        <p className="adm-meta mt-1 tracking-[0.18em] text-forest-70">Admin</p>
        <h1 className="adm-title mt-6 text-forest">로그인</h1>
        {changed ? (
          <p className="adm-body mt-4 text-forest">비밀번호를 바꿨습니다. 새 비밀번호로 다시 로그인해 주세요.</p>
        ) : null}
        <label className="mt-6 block">
          <span className="adm-label mb-1.5 block text-forest-70">비밀번호</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="adm-input h-11 w-full rounded-[4px] border border-ink-50 bg-white px-3 text-forest focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest"
          />
        </label>
        {state.error && <p className="adm-body mt-4 text-danger">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="adm-body mt-6 h-11 w-full rounded-[4px] bg-forest font-medium text-white disabled:opacity-45"
        >
          {pending ? "확인 중…" : "들어가기"}
        </button>
      </form>
    </div>
  );
}
