import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/dal";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAdmin();
  redirect("/admin/checks");
}
