"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { removeMedia } from "@/lib/cms/media";

export async function deleteMedia(formData: FormData) {
  await requireAdmin();
  await removeMedia(String(formData.get("name") ?? ""));
  revalidatePath("/admin/media");
}
