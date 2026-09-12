"use client";

import { useActionState } from "react";

import { ADM_INPUT } from "../_components/fields";

import { changeAdminPassword, type PasswordState } from "./password-actions";

export function PasswordForm({ canChange }: { canChange: boolean }) {
  const [state, action, pending] = useActionState(
    changeAdminPassword,
    { error: null } satisfies PasswordState,
  );

  return (
    <form id="password" action={action} className="scroll-mt-6 rounded-[6px] border border-ink-15 bg-white p-5">
      <h2 className="adm-h text-forest">관리자 비밀번호</h2>
      <p className="adm-body mt-1 text-ink-70">
        지금 비밀번호를 확인한 뒤에만 바꿉니다. 바꾸면 바로 로그아웃되고 다시 로그인해야 합니다.
      </p>
      {!canChange ? (
        <p className="adm-body mt-4 text-danger">이 환경에서는 비밀번호를 바꿀 수 없습니다.</p>
      ) : null}
      <div className="mt-4 grid gap-5 sm:max-w-md">
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">현재 비밀번호</span>
          <input
            className={ADM_INPUT}
            name="current"
            type="password"
            autoComplete="current-password"
            required
            disabled={!canChange}
          />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">새 비밀번호</span>
          <input
            className={ADM_INPUT}
            name="next"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            disabled={!canChange}
          />
        </label>
        <label className="block">
          <span className="adm-label mb-1.5 block text-forest-70">새 비밀번호 확인</span>
          <input
            className={ADM_INPUT}
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            disabled={!canChange}
          />
        </label>
      </div>
      {state.error ? <p className="adm-body mt-4 text-danger">{state.error}</p> : null}
      <div className="mt-6 border-t border-ink-10 pt-4">
        <button
          type="submit"
          disabled={pending || !canChange}
          className="adm-body h-10 rounded-[4px] bg-forest px-5 font-medium text-white disabled:opacity-45"
        >
          {pending ? "변경 중…" : "변경"}
        </button>
      </div>
    </form>
  );
}
