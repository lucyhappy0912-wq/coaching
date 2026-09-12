import { cookies } from "next/headers";

import { ADMIN_COOKIE, SESSION_MAX_AGE } from "./session";

export async function setAdminCookie(token: string) {
  const jar = await cookies();
  jar.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
