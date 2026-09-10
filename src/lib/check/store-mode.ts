import "server-only";

export type CheckStoreMode = "supabase" | "jsonl" | "readonly";

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

export function supabaseConfig() {
  const url = readEnv("SUPABASE_URL").replace(/\/$/, "").replace(/\/rest\/v1$/i, "");
  const key = readEnv("SUPABASE_SECRET_KEY");
  return { url, key, ok: Boolean(url && key) };
}

export function checkStoreMode(): CheckStoreMode {
  if (supabaseConfig().ok) return "supabase";
  if (readEnv("VERCEL")) return "readonly";
  return "jsonl";
}
