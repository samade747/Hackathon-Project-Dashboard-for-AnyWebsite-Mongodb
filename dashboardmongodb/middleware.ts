// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("[Middleware] Pathname:", pathname);

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    // Check for session cookie
    const sessionCookie = req.cookies.get("session")?.value;
    console.log("[Middleware] Session cookie:", sessionCookie);

    if (!sessionCookie) {
      console.log("[Middleware] No session cookie found; redirecting to /admin/login");
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Parse session cookie (assumes it's stored as base64 of JSON)
    let session: { userId: string; role: string };
    try {
      const jsonStr = Buffer.from(sessionCookie, "base64").toString("utf8");
      session = JSON.parse(jsonStr);
      console.log("[Middleware] Parsed session:", session);
    } catch (err) {
      console.error("[Middleware] Invalid session cookie:", err);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const role = session.role;
    console.log("[Middleware] User role:", role);

    // Role-based access checks:
    // 1. Admin and Manager: full access
    if (["admin", "manager"].includes(role)) {
      console.log("[Middleware] Access granted for admin/manager.");
      return NextResponse.next();
    }

    // 2. Editor: allowed only on /admin/products and /admin/dashboard
    if (role === "editor") {
      if (
        pathname.startsWith("/admin/products") ||
        pathname.startsWith("/admin/dashboard")
      ) {
        console.log("[Middleware] Access granted for editor on allowed path.");
        return NextResponse.next();
      }
      console.log("[Middleware] Editor not allowed to access:", pathname);
      return NextResponse.redirect(new URL("/admin/no-access", req.url));
    }

    // 3. Orderer: allowed only on /admin/orders and /admin/dashboard
    if (role === "orderer") {
      if (
        pathname.startsWith("/admin/orders") ||
        pathname.startsWith("/admin/dashboard")
      ) {
        console.log("[Middleware] Access granted for orderer on allowed path.");
        return NextResponse.next();
      }
      console.log("[Middleware] Orderer not allowed to access:", pathname);
      return NextResponse.redirect(new URL("/admin/no-access", req.url));
    }

    // 4. Accountant: allowed only on /admin/revenue and /admin/dashboard
    if (role === "accountant") {
      if (
        pathname.startsWith("/admin/revenue") ||
        pathname.startsWith("/admin/dashboard")
      ) {
        console.log("[Middleware] Access granted for accountant on allowed path.");
        return NextResponse.next();
      }
      console.log("[Middleware] Accountant not allowed to access:", pathname);
      return NextResponse.redirect(new URL("/admin/no-access", req.url));
    }

    // 5. For any other roles, redirect to no access
    console.log("[Middleware] Role not authorized for this route.");
    return NextResponse.redirect(new URL("/admin/no-access", req.url));
  }

  // For non-admin routes, do nothing special
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Only protect /admin routes
//   if (pathname.startsWith("/admin")) {
//     // Check if a session cookie exists
//     const sessionCookie = req.cookies.get("session")?.value;
//     if (!sessionCookie) {
//       // No session => redirect to login
//       return NextResponse.redirect(new URL("/admin/login", req.url));
//     }

//     // Parse the session cookie (stored as base64 of JSON)
//     let session: { userId: string; role: string };
//     try {
//       const jsonStr = Buffer.from(sessionCookie, "base64").toString("utf8");
//       session = JSON.parse(jsonStr);
//     } catch (err) {
//       console.error("Invalid session cookie:", err);
//       return NextResponse.redirect(new URL("/admin/login", req.url));
//     }

//     const role = session.role;

//     // Role-based access:
//     // - admin and manager: full access
//     if (["admin", "manager"].includes(role)) {
//       return NextResponse.next();
//     }

//     // - editor: allowed access to /admin/products and /admin/dashboard
//     if (role === "editor") {
//       if (
//         pathname.startsWith("/admin/products") ||
//         pathname.startsWith("/admin/dashboard")
//       ) {
//         return NextResponse.next();
//       }
//       return NextResponse.redirect(new URL("/admin/no-access", req.url));
//     }

//     // - orderer: allowed access to /admin/orders and /admin/dashboard
//     if (role === "orderer") {
//       if (
//         pathname.startsWith("/admin/orders") ||
//         pathname.startsWith("/admin/dashboard")
//       ) {
//         return NextResponse.next();
//       }
//       return NextResponse.redirect(new URL("/admin/no-access", req.url));
//     }

//     // - accountant: allowed access to /admin/revenue and /admin/dashboard
//     if (role === "accountant") {
//       if (
//         pathname.startsWith("/admin/revenue") ||
//         pathname.startsWith("/admin/dashboard")
//       ) {
//         return NextResponse.next();
//       }
//       return NextResponse.redirect(new URL("/admin/no-access", req.url));
//     }

//     // If none of the roles match, deny access
//     return NextResponse.redirect(new URL("/admin/no-access", req.url));
//   }

//   // For non-admin routes, simply proceed
//   return NextResponse.next();
// }

// // Ensure the middleware only applies to /admin routes
// export const config = {
//   matcher: ["/admin/:path*"],
// };




// // // middleware.ts
// // import { NextRequest, NextResponse } from "next/server";

// // export function middleware(req: NextRequest) {
// //   const { pathname } = req.nextUrl;

// //   // Only protect /admin routes
// //   if (pathname.startsWith("/admin")) {
// //     // 1) Check if we have a session cookie
// //     const cookie = req.cookies.get("session")?.value;
// //     if (!cookie) {
// //       // Not logged in => redirect to /admin/login
// //       return NextResponse.redirect(new URL("/admin/login", req.url));
// //     }

// //     // 2) Parse session from base64
// //     let session: { userId: string; role: string };
// //     try {
// //       const jsonStr = Buffer.from(cookie, "base64").toString("utf8");
// //       session = JSON.parse(jsonStr);
// //     } catch (err) {
// //       console.error("Invalid session cookie:", err);
// //       // If session cookie is invalid, redirect to login
// //       return NextResponse.redirect(new URL("/admin/login", req.url));
// //     }

// //     const role = session.role;
// //     // Roles: admin, manager, editor, orderer, accountant
// //     // Adjust these if you have other roles or logic

// //     // ------------- Role-based checks ----------------
// //     // 1) admin or manager => full access
// //     if (["admin", "manager"].includes(role)) {
// //       return NextResponse.next();
// //     }

// //     // 2) editor => /admin/products, /admin/dashboard
// //     if (role === "editor") {
// //       if (
// //         pathname.startsWith("/admin/products") ||
// //         pathname.startsWith("/admin/dashboard")
// //       ) {
// //         return NextResponse.next();
// //       }
// //       return NextResponse.redirect(new URL("/admin/no-access", req.url));
// //     }

// //     // 3) orderer => /admin/orders, /admin/dashboard
// //     if (role === "orderer") {
// //       if (
// //         pathname.startsWith("/admin/orders") ||
// //         pathname.startsWith("/admin/dashboard")
// //       ) {
// //         return NextResponse.next();
// //       }
// //       return NextResponse.redirect(new URL("/admin/no-access", req.url));
// //     }

// //     // 4) accountant => /admin/revenue, /admin/dashboard
// //     if (role === "accountant") {
// //       if (
// //         pathname.startsWith("/admin/revenue") ||
// //         pathname.startsWith("/admin/dashboard")
// //       ) {
// //         return NextResponse.next();
// //       }
// //       return NextResponse.redirect(new URL("/admin/no-access", req.url));
// //     }

// //     // 5) otherwise => no access
// //     return NextResponse.redirect(new URL("/admin/no-access", req.url));
// //   }

// //   // If not an /admin route, do nothing special
// //   return NextResponse.next();
// // }

// // // Apply middleware only to /admin routes
// // export const config = {
// //   matcher: ["/admin/:path*"],
// // };


// // // // middleware.ts
// // // import { NextRequest, NextResponse } from "next/server";

// // // export function middleware(req: NextRequest) {
// // //   const { pathname } = req.nextUrl;

// // //   // Only protect /admin routes:
// // //   if (pathname.startsWith("/admin")) {
// // //     // 1) Check if we have a session cookie
// // //     const cookie = req.cookies.get("session")?.value;
// // //     if (!cookie) {
// // //       // Not logged in; redirect to /admin/login
// // //       return NextResponse.redirect(new URL("/admin/login", req.url));
// // //     }

// // //     // 2) Parse session from base64
// // //     let session: { userId: string; role: string };
// // //     try {
// // //       const jsonStr = Buffer.from(cookie, "base64").toString("utf8");
// // //       session = JSON.parse(jsonStr);
// // //     } catch (err) {
// // //       console.error("Invalid session cookie:", err);
// // //       // If session cookie is invalid, force re-login
// // //       return NextResponse.redirect(new URL("/admin/login", req.url));
// // //     }

// // //     const userRole = session.role;
// // //     // Example roles: admin, manager, editor, orderer, accountant
// // //     // Adjust this logic to match your own roles & routes.

// // //     // Admin or Manager => full access
// // //     if (["admin", "manager"].includes(userRole)) {
// // //       return NextResponse.next();
// // //     }

// // //     // Editor => can access /admin/products and /admin/dashboard
// // //     if (userRole === "editor") {
// // //       if (
// // //         pathname.startsWith("/admin/products") ||
// // //         pathname.startsWith("/admin/dashboard")
// // //       ) {
// // //         return NextResponse.next();
// // //       }
// // //       // Otherwise, no access
// // //       return NextResponse.redirect(new URL("/admin/no-access", req.url));
// // //     }

// // //     // Orderer => can access /admin/orders and /admin/dashboard
// // //     if (userRole === "orderer") {
// // //       if (
// // //         pathname.startsWith("/admin/orders") ||
// // //         pathname.startsWith("/admin/dashboard")
// // //       ) {
// // //         return NextResponse.next();
// // //       }
// // //       return NextResponse.redirect(new URL("/admin/no-access", req.url));
// // //     }

// // //     // Accountant => can access /admin/revenue and /admin/dashboard
// // //     if (userRole === "accountant") {
// // //       if (
// // //         pathname.startsWith("/admin/revenue") ||
// // //         pathname.startsWith("/admin/dashboard")
// // //       ) {
// // //         return NextResponse.next();
// // //       }
// // //       return NextResponse.redirect(new URL("/admin/no-access", req.url));
// // //     }

// // //     // If none of the above roles match, redirect to /admin/no-access
// // //     return NextResponse.redirect(new URL("/admin/no-access", req.url));
// // //   }

// // //   // If not /admin route, do nothing special
// // //   return NextResponse.next();
// // // }

// // // // This ensures the middleware only runs for /admin routes
// // // export const config = {
// // //   matcher: ["/admin/:path*"],
// // // };



// // // // // app/middleware.ts
// // // // import { NextRequest, NextResponse } from "next/server";

// // // // export function middleware(req: NextRequest) {
// // // //   const url = req.nextUrl;
// // // //   const pathname = url.pathname;

// // // //   // Protect /admin
// // // //   if (pathname.startsWith("/admin")) {
// // // //     const cookie = req.cookies.get("session")?.value;
// // // //     if (!cookie) {
// // // //       return NextResponse.redirect(new URL("/admin/login", req.url));
// // // //     }

// // // //     let session;
// // // //     try {
// // // //       const jsonStr = Buffer.from(cookie, "base64").toString("utf8");
// // // //       session = JSON.parse(jsonStr);
// // // //     } catch (err) {
// // // //       console.error("Invalid session cookie");
// // // //       return NextResponse.redirect(new URL("/admin/login", req.url));
// // // //     }

// // // //     const role = session.role;

// // // //     // admin or manager => full
// // // //     if (["admin", "manager"].includes(role)) {
// // // //       return NextResponse.next();
// // // //     }

// // // //     // editor => /admin/products, /admin/dashboard
// // // //     if (role === "editor") {
// // // //       if (
// // // //         pathname.startsWith("/admin/products") ||
// // // //         pathname.startsWith("/admin/dashboard")
// // // //       ) {
// // // //         return NextResponse.next();
// // // //       }
// // // //       return NextResponse.redirect(new URL("/admin/no-access", req.url));
// // // //     }

// // // //     // orderer => /admin/orders, /admin/dashboard
// // // //     if (role === "orderer") {
// // // //       if (
// // // //         pathname.startsWith("/admin/orders") ||
// // // //         pathname.startsWith("/admin/dashboard")
// // // //       ) {
// // // //         return NextResponse.next();
// // // //       }
// // // //       return NextResponse.redirect(new URL("/admin/no-access", req.url));
// // // //     }

// // // //     // accountant => /admin/revenue, /admin/dashboard
// // // //     if (role === "accountant") {
// // // //       if (
// // // //         pathname.startsWith("/admin/revenue") ||
// // // //         pathname.startsWith("/admin/dashboard")
// // // //       ) {
// // // //         return NextResponse.next();
// // // //       }
// // // //       return NextResponse.redirect(new URL("/admin/no-access", req.url));
// // // //     }

// // // //     // otherwise no
// // // //     return NextResponse.redirect(new URL("/admin/no-access", req.url));
// // // //   }

// // // //   return NextResponse.next();
// // // // }

// // // // export const config = {
// // // //   matcher: ["/admin/:path*"],
// // // // };
