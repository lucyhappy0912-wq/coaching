import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

import { ADMIN_COOKIE, verifySessionToken } from "./session";

export const requireAdmin = cache(async () => {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) redirect("/admin/login");
  return session;
});
