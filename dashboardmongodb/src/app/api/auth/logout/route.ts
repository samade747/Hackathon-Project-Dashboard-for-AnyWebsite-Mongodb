// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Clear session cookie
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set({
    name: "session",
    value: "",
    path: "/",
    expires: new Date(0),
  });
  return res;
}
