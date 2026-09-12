"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/dal";
import { removePost, savePost } from "@/lib/cms/store";

export async function upsertPost(formData: FormData) {
  await requireAdmin();
  const id = await savePost({
    id: String(formData.get("id") ?? "") || undefined,
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    published: formData.get("published") === "on",
  });
  revalidatePath("/admin/posts");
  revalidatePath("/board");
  revalidatePath(`/board/${id}`);
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  await removePost(String(formData.get("id") ?? ""));
  revalidatePath("/admin/posts");
  revalidatePath("/board");
  redirect("/admin/posts");
}
