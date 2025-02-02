// app/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    // Check session cookie
    const cookie = req.cookies.get("session")?.value;
    if (!cookie) {
      // Not logged in
      return NextResponse.redirect(new URL("/admin/(auth)/login", req.url));
    }

    // decode
    let session: { userId: string; role: string };
    try {
      const jsonStr = Buffer.from(cookie, "base64").toString("utf8");
      session = JSON.parse(jsonStr);
    } catch (err) {
      console.error("Invalid session cookie");
      return NextResponse.redirect(new URL("/admin/(auth)/login", req.url));
    }

    const userRole = session.role;

    // If admin or manager => access all
    if (["admin", "manager"].includes(userRole)) {
      return NextResponse.next();
    }

    // If "editor" => can access /admin/products, /admin/dashboard
    if (userRole === "editor") {
      if (
        pathname.startsWith("/admin/products") ||
        pathname.startsWith("/admin/dashboard")
      ) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/admin/no-access", req.url));
      }
    }

    // If "orderer" => can access /admin/orders
    if (userRole === "orderer") {
      if (
        pathname.startsWith("/admin/orders") ||
        pathname.startsWith("/admin/dashboard")
      ) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/admin/no-access", req.url));
      }
    }

    // If "accountant" => can access /admin/revenue
    if (userRole === "accountant") {
      if (
        pathname.startsWith("/admin/revenue") ||
        pathname.startsWith("/admin/dashboard")
      ) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/admin/no-access", req.url));
      }
    }

    // Otherwise, no access
    return NextResponse.redirect(new URL("/admin/no-access", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
