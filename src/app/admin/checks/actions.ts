"use server";

import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/dal";
import { removeCheckForAdmin } from "@/lib/check/store";

export async function deleteCheck(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const confirm = String(formData.get("confirm") ?? "").trim();
  if (confirm !== "삭제") return;
  await removeCheckForAdmin(id);
  redirect("/admin/checks");
}
