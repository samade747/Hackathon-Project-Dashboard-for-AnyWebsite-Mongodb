// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password, twoFactorToken } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return NextResponse.json({
          error: "2FA code required",
          twoFactorRequired: true,
        }, { status: 401 });
      }
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: twoFactorToken,
      });
      if (!verified) {
        return NextResponse.json({ error: "Invalid 2FA code" }, { status: 401 });
      }
    }

    // Build session object
    const sessionObj = {
      userId: user._id.toString(),
      role: user.role, 
    };

    // Convert to base64
    const sessionStr = JSON.stringify(sessionObj);
    const cookieValue = Buffer.from(sessionStr).toString("base64");

    // Return cookie
    const response = NextResponse.json({ message: "Login successful", role: user.role });
    response.cookies.set({
      name: "session",
      value: cookieValue,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
