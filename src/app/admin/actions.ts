"use server";

import { redirect } from "next/navigation";

import { clearAdminCookie } from "@/lib/auth/cookie";

export async function logout() {
  await clearAdminCookie();
  redirect("/admin/login");
}
