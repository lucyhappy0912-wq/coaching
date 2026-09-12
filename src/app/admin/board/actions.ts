"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/dal";
import { answerQuestion, removeQuestion } from "@/lib/board/store";

export async function saveAnswer(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await answerQuestion(id, String(formData.get("answer") ?? ""), formData.get("published") === "on");
  revalidatePath("/admin");
  revalidatePath("/admin/board");
  revalidatePath("/board");
  revalidatePath(`/board/${id}`);
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
