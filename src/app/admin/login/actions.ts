"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyPassword } from "@/lib/auth/password";
import { ADMIN_COOKIE, adminAuthConfigured, issueSessionToken, SESSION_MAX_AGE } from "@/lib/auth/session";

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

  const hash = process.env.ADMIN_PASSWORD_HASH as string;
  const ok = await verifyPassword(password, hash);
  if (!ok) {
    await waitRemaining(started);
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  const token = issueSessionToken();
  if (!token) {
    await waitRemaining(started);
    return { error: "로그인할 수 없습니다." };
  }

  const jar = await cookies();
  jar.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  await waitRemaining(started);
  redirect("/admin/checks");
}
