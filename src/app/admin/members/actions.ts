"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { addMember, removeMember } from "@/lib/cms/store";

export async function createMember(formData: FormData) {
  await requireAdmin();
  await addMember({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
  revalidatePath("/admin/members");
}

export async function deleteMember(formData: FormData) {
  await requireAdmin();
  await removeMember(String(formData.get("id") ?? ""));
  revalidatePath("/admin/members");
}
