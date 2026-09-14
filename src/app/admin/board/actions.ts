"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/dal";
import { answerQuestion, removeQuestion } from "@/lib/board/store";

export type BoardSaveState = { ok: boolean; error?: string; stamp?: number };

function boardFailMessage(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "BOARD_STORE_READONLY" || code === "STORE_READONLY") {
    return "이 환경에서는 저장할 수 없습니다. 저장소 주소와 키를 확인해 주세요.";
  }
  if (code === "STORE_NO_TABLE") {
    return "질문 표(board_questions)가 없습니다. Supabase SQL Editor에서 게시판 마이그레이션을 실행해 주세요.";
  }
  if (code === "STORE_AUTH") {
    return "저장소가 권한을 거절했습니다. 서버 비밀 키를 확인해 주세요.";
  }
  if (code === "STORE_WRITE_FAILED:0" || code.startsWith("STORE_WRITE_FAILED")) {
    return "답을 쓰지 못했습니다. 표와 서버 비밀 키를 확인해 주세요.";
  }
  return "저장하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

function revalidateBoard(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/board");
  revalidatePath(`/admin/board/${id}`);
  revalidatePath("/board");
  revalidatePath(`/board/${id}`);
}

export async function saveAnswer(_prev: BoardSaveState, formData: FormData): Promise<BoardSaveState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  try {
    const wrote = await answerQuestion(id, String(formData.get("answer") ?? ""));
    if (!wrote) return { ok: false, error: "질문을 찾지 못했습니다." };
  } catch (error) {
    return { ok: false, error: boardFailMessage(error) };
  }
  revalidateBoard(id);
  return { ok: true, stamp: Date.now() };
}

export async function deleteQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await removeQuestion(id);
  revalidatePath("/admin");
  revalidatePath("/admin/board");
  revalidatePath("/board");
  redirect("/admin/board");
}
