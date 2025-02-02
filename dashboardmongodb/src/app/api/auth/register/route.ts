// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password, role } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email,
      passwordHash,
      role: role || "editor", // default role if none provided
    });

    return NextResponse.json({ message: "User registered", userId: newUser._id });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
