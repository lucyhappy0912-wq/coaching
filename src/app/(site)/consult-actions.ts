"use server";

import { revalidatePath } from "next/cache";

import { createLead } from "@/lib/leads/store";
import { honeypotFilled } from "@/lib/honeypot";

export type ConsultState = { status: "idle" | "done" | "error"; message?: string };

export async function submitConsult(_prev: ConsultState, formData: FormData): Promise<ConsultState> {
  if (honeypotFilled(formData)) return { status: "done" };
  if (formData.get("agree") !== "on") {
    return { status: "error", message: "개인정보 수집·이용에 동의해 주세요." };
  }
  try {
    await createLead({
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      preferredTime: String(formData.get("preferredTime") ?? ""),
      message: String(formData.get("message") ?? ""),
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "LEAD_INVALID") {
      return { status: "error", message: "이름과 연락처를 정확히 입력해 주세요." };
    }
    return { status: "error", message: "잠시 후 다시 시도해 주세요." };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return { status: "done" };
}
