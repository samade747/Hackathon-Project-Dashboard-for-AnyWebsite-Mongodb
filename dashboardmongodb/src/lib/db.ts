// lib/db.ts
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!)
      .then((m) => m)
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
