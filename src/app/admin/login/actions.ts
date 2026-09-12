"use server";

import { redirect } from "next/navigation";

import { setAdminCookie } from "@/lib/auth/cookie";
import { readAuthMaterial } from "@/lib/auth/material";
import { verifyPassword } from "@/lib/auth/password";
import { adminAuthConfigured, issueSessionToken } from "@/lib/auth/session";

export type LoginState = { error: string | null };

const MIN_MS = 700;

async function waitRemaining(started: number) {
  const wait = MIN_MS - (Date.now() - started);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const started = Date.now();
  const password = String(formData.get("password") ?? "");

  if (!adminAuthConfigured()) {
    await waitRemaining(started);
    return { error: "로그인할 수 없습니다." };
  }

  const material = readAuthMaterial();
  if (!material) {
    await waitRemaining(started);
    return { error: "로그인할 수 없습니다." };
  }
  const ok = await verifyPassword(password, material.hash);
  if (!ok) {
    await waitRemaining(started);
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  const token = issueSessionToken();
  if (!token) {
    await waitRemaining(started);
    return { error: "로그인할 수 없습니다." };
  }

  await setAdminCookie(token);
  await waitRemaining(started);
  redirect("/admin/checks");
}
