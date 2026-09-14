"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/dal";
import { isLiftLead } from "@/lib/leads/kind";
import { getLeadForAdmin, removeLead, setLeadStatus, type LeadStatus } from "@/lib/leads/store";

const STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

export async function updateLeadStatus(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (!STATUSES.includes(status)) return;
  await setLeadStatus(String(formData.get("id") ?? ""), status);
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/lift");
}

export async function deleteLead(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const row = await getLeadForAdmin(id);
  await removeLead(id);
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/lift");
  redirect(row && isLiftLead(row) ? "/admin/lift" : "/admin/inquiries");
}
