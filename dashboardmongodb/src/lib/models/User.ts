// lib/models/User.ts
import mongoose, { Schema, model, models } from "mongoose";

/**
 * Roles: admin, manager, editor, orderer, accountant
 */
const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "editor" },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: "" },
});

export const User = models.User || model("User", UserSchema);
