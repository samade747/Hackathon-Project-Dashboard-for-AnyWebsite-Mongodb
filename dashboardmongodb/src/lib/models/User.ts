// eslint-disable-next-line @typescript-eslint/no-unused-vars

import mongoose, { Schema, model, models } from "mongoose";

/**
 * Roles: admin, manager, editor, orderer, accountant, etc.
 */
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,  // Must be unique if provided
    sparse: true,  // Allows multiple users without a username
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "editor",
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
    default: "",
  },
});

export const User = models.User || model("User", UserSchema);


// import mongoose, { Schema, model, models } from "mongoose";

// /**
//  * Roles: admin, manager, editor, orderer, accountant, etc.
//  */
// const UserSchema = new Schema({
//   username: {
//     type: String,
//     unique: true,  // Must be unique if set
//     sparse: true,  // Allows multiple users to have null usernames
//     trim: true,
//     lowercase: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   passwordHash: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     default: "editor",
//   },
//   twoFactorEnabled: {
//     type: Boolean,
//     default: false,
//   },
//   twoFactorSecret: {
//     type: String,
//     default: "",
//   },
// });

// export const User = models.User || model("User", UserSchema);


// // lib/models/User.ts

// import mongoose, { Schema, model, models } from "mongoose";

// /**
//  * Roles: admin, manager, editor, orderer, accountant, etc.
//  */
// const UserSchema = new Schema({
//   username: {
//     type: String,
//     unique: true,   // must be unique if set
//     sparse: true,   // allow multiple docs with no username
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   passwordHash: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     default: "editor",
//   },
//   twoFactorEnabled: {
//     type: Boolean,
//     default: false,
//   },
//   twoFactorSecret: {
//     type: String,
//     default: "",
//   },
// });

// export const User = models.User || model("User", UserSchema);


// // lib/models/User.ts
// import mongoose, { Schema, model, models } from "mongoose";

// /**
//  * Roles: admin, manager, editor, orderer, accountant
//  */
// const UserSchema = new Schema({
//   // We are requiring 'username' to always be provided.orderer
//   // It's also unique, trimmed, and stored in lowercase.
//   username: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true,
//     lowercase: true,
//   },
//   email: { type: String, unique: true, required: true },
//   passwordHash: { type: String, required: true },
//   role: { type: String, default: "orderer" },
//   twoFactorEnabled: { type: Boolean, default: false },
//   twoFactorSecret: { type: String, default: "" },
// });

// export const User = models.User || model("User", UserSchema);


// // lib/models/User.ts
// import mongoose, { Schema, model, models } from "mongoose";

// /**
//  * Roles: admin, manager, editor, orderer, accountant
//  */
// const UserSchema = new Schema({
//   username: {
//     type: String,
//     unique: true,   // must be unique if set
//     sparse: true,   // allow multiple docs with no username
//   },
//   email: { type: String, unique: true, required: true },
//   passwordHash: { type: String, required: true },
//   role: { type: String, default: "editor" },
//   twoFactorEnabled: { type: Boolean, default: false },
//   twoFactorSecret: { type: String, default: "" },
// });

// export const User = models.User || model("User", UserSchema);
