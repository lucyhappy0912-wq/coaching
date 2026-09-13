import "server-only";

export type CheckStoreMode = "supabase" | "jsonl" | "readonly";

export function supabaseConfig() {
  const url = (process.env.SUPABASE_URL ?? "").trim().replace(/\/$/, "").replace(/\/rest\/v1$/i, "");
  const key = (process.env.SUPABASE_SECRET_KEY ?? "").trim();
  return { url, key, ok: Boolean(url && key) };
}

export function checkStoreMode(): CheckStoreMode {
  if (supabaseConfig().ok) return "supabase";
  if (process.env.VERCEL) return "readonly";
  return "jsonl";
}

export const dataStoreMode = checkStoreMode;
