"use server";

import { revalidatePath } from "next/cache";

import { createQuestion } from "@/lib/board/store";
import { honeypotFilled } from "@/lib/honeypot";

export type BoardAskState = { status: "idle" | "done" | "error"; message?: string };

export async function submitQuestion(_prev: BoardAskState, formData: FormData): Promise<BoardAskState> {
  if (honeypotFilled(formData)) return { status: "done" };
  try {
    await createQuestion({
      name: String(formData.get("name") ?? ""),
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "BOARD_INVALID") {
      return { status: "error", message: "이름·제목·질문을 조금 더 적어 주세요." };
    }
    if (code === "BOARD_STORE_READONLY" || code === "STORE_READONLY") {
      return { status: "error", message: "지금은 질문을 받을 수 없습니다. 전화로 문의해 주세요." };
    }
    if (code === "STORE_NO_TABLE") {
      return { status: "error", message: "접수가 아직 준비되지 않았습니다. 전화로 문의해 주세요." };
    }
    if (code === "STORE_AUTH" || code.startsWith("STORE_WRITE_FAILED") || code === "BOARD_STORE_WRITE_FAILED") {
      return { status: "error", message: "질문을 저장하지 못했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요." };
    }
    return { status: "error", message: "잠시 후 다시 시도해 주세요." };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/board");
  return { status: "done" };
}
