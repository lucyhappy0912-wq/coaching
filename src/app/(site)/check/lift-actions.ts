"use server";

import { revalidatePath } from "next/cache";

import { honeypotFilled } from "@/lib/honeypot";
import { LIFT_KIND, LIFT_MESSAGE } from "@/lib/leads/kind";
import { createLead } from "@/lib/leads/store";

export type LiftApplyState = { status: "idle" | "done" | "error"; message?: string };

export async function applyLift(_prev: LiftApplyState, formData: FormData): Promise<LiftApplyState> {
  if (honeypotFilled(formData)) return { status: "done" };
  const name = String(formData.get("name") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  const note = email ? `${LIFT_MESSAGE}\n이메일: ${email}` : LIFT_MESSAGE;
  try {
    await createLead({
      name,
      phone,
      preferredTime: LIFT_KIND,
      message: note,
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "LEAD_INVALID") return { status: "error", message: "이름 정보가 없어 신청하지 못했습니다." };
    if (code === "LEAD_PHONE") return { status: "error", message: "연락처 정보가 없어 신청하지 못했습니다." };
    if (code === "LEAD_STORE_READONLY" || code === "STORE_READONLY") {
      return { status: "error", message: "지금은 신청을 받을 수 없습니다." };
    }
    if (code === "STORE_NO_TABLE") {
      return { status: "error", message: "접수가 아직 준비되지 않았습니다." };
    }
    return { status: "error", message: "신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/lift");
  return { status: "done" };
}
