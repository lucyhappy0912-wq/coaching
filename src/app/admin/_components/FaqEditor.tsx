"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import type { CmsFaq } from "@/lib/cms/types";

import { saveFaqs, type SaveState } from "../site/actions";
import { ADM_AREA, ADM_INPUT } from "./fields";
import { SaveBar } from "./SaveBar";

export function FaqEditor({ initial, canSave }: { initial: CmsFaq[]; canSave: boolean }) {
  const start = [...initial, ...Array.from({ length: 12 }, () => ({ q: "", a: "" }))].slice(0, 12);
  const [value, setValue] = useState(start);
  const valueRef = useRef(value);
  valueRef.current = value;
  const [saved, setSaved] = useState(start);
  const [state, action, pending] = useActionState(saveFaqs, { ok: false } satisfies SaveState);

  useEffect(() => {
    if (state.ok && state.stamp) setSaved(valueRef.current);
  }, [state.ok, state.stamp]);

  const dirty = JSON.stringify(value) !== JSON.stringify(saved);
  const status = pending
    ? "저장 중…"
    : state.error
      ? state.error
      : dirty
        ? "저장하지 않은 변경이 있습니다."
        : state.ok
          ? "저장했습니다."
          : "질문과 답이 둘 다 있는 칸만 사이트에 나갑니다.";

  return (
    <form action={action} className="space-y-4">
      {!canSave ? <p className="adm-body text-danger">이 환경에서는 저장할 수 없습니다.</p> : null}
      {value.map((item, index) => (
        <section key={index} className="rounded-[6px] border border-ink-15 bg-white p-5">
          <p className="adm-meta mb-3 text-ink-70">{String(index + 1).padStart(2, "0")}</p>
          <input
            className={ADM_INPUT}
            name={`faq.${index}.q`}
            value={item.q}
            placeholder="질문"
            onChange={(event) =>
              setValue((current) => current.map((row, i) => (i === index ? { ...row, q: event.target.value } : row)))
            }
          />
          <textarea
            className={`${ADM_AREA} mt-3`}
            name={`faq.${index}.a`}
            value={item.a}
            placeholder="답"
            onChange={(event) =>
              setValue((current) => current.map((row, i) => (i === index ? { ...row, a: event.target.value } : row)))
            }
          />
        </section>
      ))}
      <SaveBar status={status} pending={pending} disabled={!canSave} onReset={() => setValue(saved)} />
    </form>
  );
}
