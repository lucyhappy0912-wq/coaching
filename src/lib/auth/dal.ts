import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

import { ADMIN_COOKIE, verifySessionToken } from "./session";

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}

export const requireAdmin = cache(async () => {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
});
