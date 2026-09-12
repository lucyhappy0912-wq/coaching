import "server-only";

import { supabaseConfig } from "@/lib/check/store-mode";

export function cmsEnabled() {
  return supabaseConfig().ok;
}

/** 원격 저장소가 없어도 로컬 개발에서는 파일에 저장한다. Vercel만 원격 없이는 읽기 전용. */
export function cmsWritable() {
  return supabaseConfig().ok || !process.env.VERCEL;
}

export async function cmsRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key, ok } = supabaseConfig();
  if (!ok) throw new Error("CMS_STORE_READONLY");
  const method = init.method ?? "GET";
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer:
        method === "GET"
          ? "return=representation"
          : "return=representation,resolution=merge-duplicates",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error("CMS_STORE_FAILED");
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
