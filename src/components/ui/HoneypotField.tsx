import { HONEYPOT_FIELD } from "@/lib/honeypot";

export function HoneypotField() {
  return (
    <input
      type="text"
      name={HONEYPOT_FIELD}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden
      className="pointer-events-none absolute left-[-10000px] h-px w-px overflow-hidden opacity-0"
    />
  );
}
