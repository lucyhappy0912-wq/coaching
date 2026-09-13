"use client";

import { useActionState } from "react";

import { submitQuestion, type BoardAskState } from "@/app/(site)/board-actions";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { cn } from "@/lib/utils";

const inputClass =
  "b2 w-full rounded-none border-0 border-b border-ink-50 bg-transparent pb-2 text-forest outline-none transition-colors placeholder:text-ink-70 focus:border-forest";

export function AskForm() {
  const [state, action, pending] = useActionState(submitQuestion, { status: "idle" } satisfies BoardAskState);

  if (state.status === "done") {
    return (
      <p className="b2 rounded-[6px] border border-forest-20 bg-white px-5 py-6 text-forest">
        질문을 받았습니다. 답변이 달리면 게시판에 올라갑니다.
      </p>
    );
  }

  return (
    <form action={action} className="border border-ink-10 bg-white p-6 lg:p-8">
      <HoneypotField />
      <p className="serif text-[20px] text-forest">질문하기</p>
      <div className="mt-6 space-y-6">
        <label className="block">
          <span className="c1 mb-2 block text-forest-70">이름</span>
          <input name="name" required autoComplete="name" className={inputClass} />
        </label>
        <label className="block">
          <span className="c1 mb-2 block text-forest-70">제목</span>
          <input name="title" required className={inputClass} />
        </label>
        <label className="block">
          <span className="c1 mb-2 block text-forest-70">질문</span>
          <textarea name="body" required rows={4} className={cn(inputClass, "resize-none")} />
        </label>
      </div>
      {state.status === "error" ? <p className="b3 mt-4 text-[#c0392b]">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="serif mt-8 h-11 rounded-sm bg-forest px-6 text-white disabled:opacity-60"
      >
        {pending ? "보내는 중…" : "질문 보내기"}
      </button>
    </form>
  );
}
