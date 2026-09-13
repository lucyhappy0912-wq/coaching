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
      return { status: "error", message: "이름을 정확히 입력해 주세요." };
    }
    if (code === "LEAD_PHONE") {
      return { status: "error", message: "휴대폰 번호는 010으로 시작하는 번호를 넣어 주세요." };
    }
    if (code === "LEAD_STORE_READONLY" || code === "STORE_READONLY") {
      return { status: "error", message: "지금은 신청을 받을 수 없습니다. 전화로 문의해 주세요." };
    }
    if (code === "STORE_NO_TABLE") {
      return { status: "error", message: "접수가 아직 준비되지 않았습니다. 전화로 문의해 주세요." };
    }
    if (code === "STORE_AUTH" || code.startsWith("STORE_WRITE_FAILED") || code === "LEAD_STORE_WRITE_FAILED") {
      return { status: "error", message: "접수를 저장하지 못했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요." };
    }
    return { status: "error", message: "잠시 후 다시 시도해 주세요." };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return { status: "done" };
}
