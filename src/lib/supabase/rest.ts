import "server-only";

import { supabaseConfig } from "@/lib/check/store-mode";

export async function dataRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key, ok } = supabaseConfig();
  if (!ok) throw new Error("STORE_READONLY");
  const method = init.method ?? "GET";
  const prefer =
    method === "GET"
      ? "return=representation"
      : method === "DELETE" || method === "POST"
        ? "return=representation"
        : "return=minimal";
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: prefer,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    const hint = /PGRST\d+/.exec(text)?.[0] ?? /22P02|23502|23505/.exec(text)?.[0] ?? String(res.status);
    if (res.status === 401 || res.status === 403) throw new Error("STORE_AUTH");
    if (
      res.status === 404 ||
      text.includes("PGRST205") ||
      text.includes("PGRST106") ||
      text.includes("does not exist")
    ) {
      throw new Error("STORE_NO_TABLE");
    }
    throw new Error(`STORE_WRITE_FAILED:${hint}`);
  }
  if (!text) return [] as T;
  return JSON.parse(text) as T;
}
