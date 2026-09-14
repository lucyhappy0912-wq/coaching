"use client";

import { useActionState } from "react";

import { ADM_AREA } from "@/app/admin/_components/fields";

import { saveAnswer, type BoardSaveState } from "./actions";

export function AnswerForm({ id, answer }: { id: string; answer: string }) {
  const [state, action, pending] = useActionState(saveAnswer, { ok: false } satisfies BoardSaveState);
  const status = pending
    ? "저장 중…"
    : state.error
      ? state.error
      : state.ok
        ? "저장했습니다."
        : "답변을 쓰면 글 아래에 붙습니다.";

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="id" value={id} />
      <label className="block">
        <span className="adm-label mb-1.5 block text-forest-70">답변</span>
        <textarea name="answer" defaultValue={answer} key={`${id}-${answer}-${state.stamp ?? 0}`} className={ADM_AREA} />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="adm-body h-10 rounded-[4px] bg-forest px-5 text-white disabled:opacity-45"
        >
          {pending ? "저장 중…" : "답변 저장"}
        </button>
        <p className={`adm-body ${state.error ? "text-danger" : "text-ink-70"}`}>{status}</p>
      </div>
    </form>
  );
}
