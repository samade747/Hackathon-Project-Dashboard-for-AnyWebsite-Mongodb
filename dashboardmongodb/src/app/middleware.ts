// app/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.get("session")?.value;
    if (!cookie) {
      return NextResponse.redirect(new URL("/admin/(auth)/login", req.url));
    }

    let session;
    try {
      const jsonStr = Buffer.from(cookie, "base64").toString("utf8");
      session = JSON.parse(jsonStr);
    } catch (err) {
      console.error("Invalid session cookie");
      return NextResponse.redirect(new URL("/admin/(auth)/login", req.url));
    }

    const role = session.role;

    // admin or manager => full
    if (["admin", "manager"].includes(role)) {
      return NextResponse.next();
    }

    // editor => /admin/products, /admin/dashboard
    if (role === "editor") {
      if (
        pathname.startsWith("/admin/products") ||
        pathname.startsWith("/admin/dashboard")
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/admin/no-access", req.url));
    }

    // orderer => /admin/orders, /admin/dashboard
    if (role === "orderer") {
      if (
        pathname.startsWith("/admin/orders") ||
        pathname.startsWith("/admin/dashboard")
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/admin/no-access", req.url));
    }

    // accountant => /admin/revenue, /admin/dashboard
    if (role === "accountant") {
      if (
        pathname.startsWith("/admin/revenue") ||
        pathname.startsWith("/admin/dashboard")
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/admin/no-access", req.url));
    }

    // otherwise no
    return NextResponse.redirect(new URL("/admin/no-access", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
