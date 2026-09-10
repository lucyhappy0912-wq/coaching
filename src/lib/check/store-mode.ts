import "server-only";

export type CheckStoreMode = "supabase" | "jsonl" | "readonly";

export function checkStoreMode(): CheckStoreMode {
  if (process.env.CHECK_STORE === "supabase") {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) return "supabase";
    return "readonly";
  }
  if (process.env.VERCEL) return "readonly";
  return "jsonl";
}
