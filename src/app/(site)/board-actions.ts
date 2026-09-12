"use server";

import { revalidatePath } from "next/cache";

import { createQuestion } from "@/lib/board/store";

export type BoardAskState = { status: "idle" | "done" | "error"; message?: string };

export async function submitQuestion(_prev: BoardAskState, formData: FormData): Promise<BoardAskState> {
  if (String(formData.get("website") ?? "")) return { status: "done" };
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
    return { status: "error", message: "잠시 후 다시 시도해 주세요." };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/board");
  return { status: "done" };
}
