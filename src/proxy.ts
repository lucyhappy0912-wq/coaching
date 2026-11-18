import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth/session";

const PAGE = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>수리중</title>
  <style>
    html, body { margin: 0; height: 100%; background: #f7f6f3; color: #1c1a17; }
    body {
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Georgia, "Times New Roman", serif;
      pointer-events: none;
      user-select: none;
    }
    h1 { margin: 0; font-size: 48px; font-weight: 500; letter-spacing: 0.04em; }
  </style>
</head>
<body>
  <h1>수리중</h1>
</body>
</html>`;

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/admin" || path.startsWith("/admin/")) {
    if (path === "/admin/login") return NextResponse.next();
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    }
    return NextResponse.next();
  }
  if (path.startsWith("/api")) return NextResponse.next();

  return new NextResponse(PAGE, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
