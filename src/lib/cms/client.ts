import "server-only";

import { supabaseConfig } from "@/lib/check/store-mode";

export function cmsEnabled() {
  return supabaseConfig().ok;
}

/** 원격 저장소가 없어도 로컬 개발에서는 파일에 저장한다. Vercel만 원격 없이는 읽기 전용. */
export function cmsWritable() {
  return supabaseConfig().ok || !process.env.VERCEL;
}

export function cmsFailMessage(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "CMS_STORE_READONLY") return "저장소 주소와 키가 없습니다.";
  if (code.includes("PGRST205")) {
    return "저장 표(cms_content)가 없습니다. Supabase SQL Editor에서 CMS 마이그레이션을 실행해 주세요.";
  }
  if (code.startsWith("CMS_STORE_FAILED:")) {
    const hint = code.slice("CMS_STORE_FAILED:".length);
    return hint ? `저장소가 거절했습니다 (${hint}).` : "저장소가 거절했습니다.";
  }
  return "저장하지 못했습니다. 저장소 연결을 확인하세요.";
}

export async function cmsRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key, ok } = supabaseConfig();
  if (!ok) throw new Error("CMS_STORE_READONLY");
  const method = init.method ?? "GET";
  const prefer =
    method === "GET"
      ? "return=representation"
      : method === "PATCH"
        ? "return=minimal"
        : method === "DELETE"
          ? "return=representation"
          : "return=representation,resolution=merge-duplicates";
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
    throw new Error(`CMS_STORE_FAILED:${hint}`);
  }
  if (!text) return [] as T;
  return JSON.parse(text) as T;
}

export async function cmsStorage(path: string, init: RequestInit = {}) {
  const { url, key, ok } = supabaseConfig();
  if (!ok) throw new Error("CMS_STORE_READONLY");
  const res = await fetch(`${url}/storage/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(init.headers ?? {}),
    },
  });
  return res;
}

export function mediaPublicUrl(name: string) {
  const { url } = supabaseConfig();
  return `${url}/storage/v1/object/public/media/${name}`;
}
