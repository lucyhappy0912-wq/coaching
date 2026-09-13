"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { isMenuHrefOn } from "@/lib/menu";
import { MENU_GROUPS } from "@/lib/site";

import { SaveBar } from "../_components/SaveBar";
import type { SaveState } from "../site/actions";

import { saveMenu } from "./actions";

function groupToggles() {
  return MENU_GROUPS.map((group) => ({
    title: group.title,
    items: group.items.filter((item) => !item.href.startsWith("tel:") && !item.href.startsWith("mailto:")),
  })).filter((group) => group.items.length > 0);
}

export function MenuForm({
  initialOff,
  initialOn,
  canSave,
}: {
  initialOff: string[];
  initialOn: string[];
  canSave: boolean;
}) {
  const groups = groupToggles();
  const [off, setOff] = useState(initialOff);
  const [onList, setOnList] = useState(initialOn);
  const visRef = useRef({ off, onList });
  visRef.current = { off, onList };
  const [saved, setSaved] = useState({ off: initialOff, onList: initialOn });
  const [state, action, pending] = useActionState(saveMenu, { ok: false } satisfies SaveState);

  useEffect(() => {
    if (state.ok && state.stamp) setSaved(visRef.current);
  }, [state.ok, state.stamp]);

  const dirty =
    JSON.stringify([...off].sort()) !== JSON.stringify([...saved.off].sort()) ||
    JSON.stringify([...onList].sort()) !== JSON.stringify([...saved.onList].sort());
  const status = pending
    ? "저장 중…"
    : state.error
      ? state.error
      : dirty
        ? "저장하지 않은 변경이 있습니다."
        : state.ok
          ? "저장했습니다. 사이트 메뉴에 바로 반영됩니다."
          : "꺼 둔 항목은 메뉴·푸터·관련 목록에서 빠지고, 주소로 들어와도 열리지 않습니다.";

  function toggle(href: string, nextOn: boolean) {
    setOff((current) => (nextOn ? current.filter((item) => item !== href) : [...current, href]));
    setOnList((current) => (nextOn ? [...current, href] : current.filter((item) => item !== href)));
  }

  return (
    <form action={action} className="space-y-6 pb-20">
      {!canSave ? <p className="adm-body text-danger">이 환경에서는 저장할 수 없습니다.</p> : null}
      {groups.map((group) => (
        <section key={group.title} className="rounded-[6px] border border-ink-15 bg-white p-5">
          <p className="adm-meta mb-4 tracking-[0.16em] text-ink-70">{group.title}</p>
          <ul className="divide-y divide-ink-10">
            {group.items.map((item) => {
              const on = isMenuHrefOn(item.href, off, onList);
              return (
                <li key={item.href} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="adm-body text-forest">{item.label}</p>
                    <p className="adm-meta mt-0.5 text-ink-70">{item.href}</p>
                  </div>
                  <label className="flex shrink-0 cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      name={`on:${item.href}`}
                      checked={on}
                      onChange={(event) => toggle(item.href, event.target.checked)}
                      className="size-4 accent-forest"
                    />
                    <span className="adm-body text-forest">{on ? "활성" : "비활성"}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <SaveBar
        status={status}
        pending={pending}
        disabled={!canSave}
        onReset={() => {
          setOff(saved.off);
          setOnList(saved.onList);
        }}
      />
    </form>
  );
}
