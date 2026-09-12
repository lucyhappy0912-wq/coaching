"use server";

import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/dal";
import { clearAdminCookie } from "@/lib/auth/cookie";
import { persistPasswordHash, readAuthMaterial } from "@/lib/auth/material";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export type PasswordState = { error: string | null };

const MIN_MS = 700;
const MIN_LEN = 12;
const MAX_LEN = 128;

async function waitRemaining(started: number) {
  const wait = MIN_MS - (Date.now() - started);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
}

export async function changeAdminPassword(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  await requireAdmin();
  const started = Date.now();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const fail = async (error: string): Promise<PasswordState> => {
    await waitRemaining(started);
    return { error };
  };

  const material = readAuthMaterial();
  if (!material) return fail("지금 환경에서는 비밀번호를 바꿀 수 없습니다.");

  if (next.length < MIN_LEN || next.length > MAX_LEN) {
    return fail(`새 비밀번호는 ${MIN_LEN}자 이상이어야 합니다.`);
  }
  if (next !== confirm) return fail("새 비밀번호가 서로 다릅니다.");
  if (next === current) return fail("지금과 다른 비밀번호를 입력해 주세요.");

  const ok = await verifyPassword(current, material.hash);
  if (!ok) return fail("현재 비밀번호가 올바르지 않습니다.");

  try {
    await persistPasswordHash(await hashPassword(next));
  } catch {
    return fail("이 환경에서는 비밀번호를 바꿀 수 없습니다.");
  }

  await clearAdminCookie();
  await waitRemaining(started);
  redirect("/admin/login?changed=1");
}
