"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createQuestion, getPublishedQuestion } from "@/lib/board/store";
import { setBoardUnlock } from "@/lib/board/unlock";
import { honeypotFilled } from "@/lib/honeypot";
import { verifyPassword } from "@/lib/auth/password";

export type BoardAskState = { status: "idle" | "done" | "error"; message?: string; id?: string };
export type BoardUnlockState = { status: "idle" | "error"; message?: string };

export async function submitQuestion(_prev: BoardAskState, formData: FormData): Promise<BoardAskState> {
  if (honeypotFilled(formData)) return { status: "done" };
  const published = formData.get("secret") !== "on";
  let id = "";
  try {
    id = await createQuestion({
      name: String(formData.get("name") ?? ""),
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
      published,
      password: String(formData.get("password") ?? ""),
    });
    revalidatePath("/admin");
    revalidatePath("/admin/board");
    revalidatePath("/board");
    revalidatePath(`/board/${id}`);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "BOARD_INVALID") {
      return { status: "error", message: "이름, 제목, 내용을 모두 적어 주세요." };
    }
    if (code === "BOARD_PASSWORD") {
      return { status: "error", message: "비밀글은 비밀번호를 4자 이상 정해 주세요." };
    }
    if (code === "BOARD_STORE_READONLY" || code === "STORE_READONLY") {
      return { status: "error", message: "지금은 글을 받을 수 없습니다. 전화로 문의해 주세요." };
    }
    if (code === "STORE_NO_TABLE") {
      return { status: "error", message: "게시판이 아직 준비되지 않았습니다. 전화로 문의해 주세요." };
    }
    if (code === "STORE_AUTH" || code.startsWith("STORE_WRITE_FAILED") || code === "BOARD_STORE_WRITE_FAILED") {
      return { status: "error", message: "글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
    }
    return { status: "error", message: "잠시 후 다시 시도해 주세요." };
  }
  redirect(`/board/${id}`);
}

export async function unlockPost(_prev: BoardUnlockState, formData: FormData): Promise<BoardUnlockState> {
  const id = String(formData.get("id") ?? "");
  const row = await getPublishedQuestion(id);
  if (!row || row.published) return { status: "error", message: "글을 찾을 수 없습니다." };
  if (!row.passwordHash) return { status: "error", message: "이 글은 관리자만 볼 수 있습니다." };
  const ok = await verifyPassword(String(formData.get("password") ?? ""), row.passwordHash);
  if (!ok) return { status: "error", message: "비밀번호가 맞지 않습니다." };
  await setBoardUnlock(id);
  revalidatePath(`/board/${id}`);
  redirect(`/board/${id}`);
}
