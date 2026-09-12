"use client";

export function SaveBar({
  status,
  pending,
  onReset,
  disabled,
}: {
  status?: string | null;
  pending?: boolean;
  onReset?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-15 bg-white/95 backdrop-blur md:pl-60">
      <div className="flex h-16 items-center justify-between px-6">
        <p className="adm-body min-w-0 truncate text-ink-70">{status ?? "저장하면 사이트에 바로 반영됩니다."}</p>
        <div className="flex shrink-0 gap-2">
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="adm-body h-10 rounded-[4px] px-4 text-forest hover:bg-ink-05"
            >
              되돌리기
            </button>
          ) : null}
          <button
            type="submit"
            disabled={pending || disabled}
            className="adm-body h-10 rounded-[4px] bg-forest px-5 font-medium text-white disabled:opacity-45"
          >
            {pending ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
