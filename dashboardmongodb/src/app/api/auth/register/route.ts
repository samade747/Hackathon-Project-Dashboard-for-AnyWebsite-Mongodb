import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { username, email, password, role } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Check if username exists only if provided
    if (username?.trim()) {
      const existingUsername = await User.findOne({ username: username.trim().toLowerCase() });
      if (existingUsername) {
        return NextResponse.json(
          { error: "Username already in use" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Prepare user object (exclude username if empty)
    const userData: any = {
      email,
      passwordHash,
      role: role || "orderer", // Default role if not provided
    };

    if (username?.trim()) {
      userData.username = username.trim().toLowerCase();
    }

    // Create new user
    const newUser = await User.create(userData);

    return NextResponse.json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (err: any) {
    console.error("Register error:", err);

    // Handle MongoDB unique constraint errors
    if (err.code === 11000) {
      if (err.keyPattern?.username) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
      if (err.keyPattern?.email) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { User } from "@/lib/models/User";
// import bcrypt from "bcrypt";

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const { username, email, password, role } = await req.json();

//     // Basic validation
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required." },
//         { status: 400 }
//       );
//     }

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Email already registered" },
//         { status: 400 }
//       );
//     }

//     // Check for existing username only if provided
//     if (username) {
//       const existingUsername = await User.findOne({ username });
//       if (existingUsername) {
//         return NextResponse.json(
//           { error: "Username already in use" },
//           { status: 400 }
//         );
//       }
//     }

//     // Hash password
//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(password, saltRounds);

//     // Create new user (username is optional)
//     const newUser = await User.create({
//       ...(username && { username }), // Only set username if provided
//       email,
//       passwordHash,
//       role: role || "orderer", // Default to 'orderer' if not provided
//     });

//     return NextResponse.json({
//       message: "User registered successfully",
//       userId: newUser._id,
//     });
//   } catch (err: any) {
//     console.error("Register error:", err);

//     // Handle MongoDB unique constraint errors
//     if (err.code === 11000) {
//       if (err.keyPattern?.username) {
//         return NextResponse.json(
//           { error: "Username already exists" },
//           { status: 400 }
//         );
//       }
//       if (err.keyPattern?.email) {
//         return NextResponse.json(
//           { error: "Email already exists" },
//           { status: 400 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
// ``


// // import { NextResponse } from "next/server";
// // import { connectDB } from "@/lib/db";
// // import { User } from "@/lib/models/User";
// // import bcrypt from "bcrypt";

// // export async function POST(req: Request) {
// //   try {
// //     await connectDB();

// //     const { username, email, password, role } = await req.json();

// //     // Basic validation
// //     if (!username || !email || !password) {
// //       return NextResponse.json(
// //         { error: "Missing username, email, or password" },
// //         { status: 400 }
// //       );
// //     }

// //     // Check for existing username or email
// //     const existingUser = await User.findOne({
// //       $or: [{ username }, { email }],
// //     });

// //     if (existingUser) {
// //       if (existingUser.username === username) {
// //         return NextResponse.json({ error: "Username already in use" }, { status: 400 });
// //       }
// //       if (existingUser.email === email) {
// //         return NextResponse.json({ error: "Email already registered" }, { status: 400 });
// //       }
// //     }

// //     // Hash password
// //     const saltRounds = 10;
// //     const passwordHash = await bcrypt.hash(password, saltRounds);

// //     // Create new user
// //     const newUser = await User.create({
// //       username,
// //       email,
// //       passwordHash,
// //       role: role || "orderer", // Default to 'orderer' if not provided
// //     });

// //     return NextResponse.json({
// //       message: "User registered successfully",
// //       userId: newUser._id,
// //     });
// //   } catch (err: any) {
// //     console.error("Register error:", err);

// //     // Handle duplicate key errors from MongoDB
// //     if (err.code === 11000) {
// //       const duplicateField = Object.keys(err.keyPattern)[0];
// //       return NextResponse.json(
// //         { error: `${duplicateField} already exists` },
// //         { status: 400 }
// //       );
// //     }

// //     return NextResponse.json(
// //       { error: "Internal Server Error" },
// //       { status: 500 }
// //     );
// //   }
// // }


// // // app/api/auth/register/route.ts
// // import { NextResponse } from "next/server";
// // import { connectDB } from "@/lib/db";
// // import { User } from "@/lib/models/User";
// // import bcrypt from "bcrypt";

// // export async function POST(req: Request) {
// //   try {
// //     await connectDB();

// //     // Expect { username, email, password, role } in body
// //     const { username, email, password, role } = await req.json();
    
// //     // Basic checks
// //     if (!username || !email || !password) {
// //       return NextResponse.json(
// //         { error: "Missing username, email, or password" },
// //         { status: 400 }
// //       );
// //     }

// //     // Optionally, you can do extra validation on 'username':
// //     // e.g., check length, allowed characters, etc.

// //     // Check if email or username already exist
// //     // For efficiency, you can do 2 separate findOne calls or a single find with $or
// //     const existingEmail = await User.findOne({ email });
// //     if (existingEmail) {
// //       return NextResponse.json(
// //         { error: "Email already taken" },
// //         { status: 400 }
// //       );
// //     }

// //     const existingUsername = await User.findOne({ username });
// //     if (existingUsername) {
// //       return NextResponse.json(
// //         { error: "Username already taken" },
// //         { status: 400 }
// //       );
// //     }

// //     // Hash password
// //     const saltRounds = 10;
// //     const passwordHash = await bcrypt.hash(password, saltRounds);

// //     // Create doc
// //     const newUser = await User.create({
// //       username,       // required, unique
// //       email,          // required, unique
// //       passwordHash,
// //       role: role || "orderer", // default role if none provided
// //     });

// //     return NextResponse.json({
// //       message: "User registered",
// //       userId: newUser._id
// //     });
// //   } catch (err: any) {
// //     console.error("Register error:", err);

// //     // If it's a duplicate key error with E11000, we can parse it to give a friendly message
// //     if (err.code === 11000) {
// //       // e.g. check which field triggered the duplication
// //       if (err.keyPattern?.username) {
// //         return NextResponse.json(
// //           { error: "Username already in use" },
// //           { status: 400 }
// //         );
// //       }
// //       if (err.keyPattern?.email) {
// //         return NextResponse.json(
// //           { error: "Email already in use" },
// //           { status: 400 }
// //         );
// //       }
// //       // fallback
// //       return NextResponse.json({ error: "Duplicate key error" }, { status: 400 });
// //     }

// //     return NextResponse.json(
// //       { error: "Internal Server Error" },
// //       { status: 500 }
// //     );
// //   }
// // }


// // // app/api/auth/register/route.ts
// // import { NextResponse } from "next/server";
// // import { connectDB } from "@/lib/db";
// // import { User } from "@/lib/models/User";
// // import bcrypt from "bcrypt";

// // export async function POST(req: Request) {
// //   try {
// //     await connectDB();

// //     const { email, password, role } = await req.json();
// //     if (!email || !password) {
// //       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
// //     }

// //     const existing = await User.findOne({ email });
// //     if (existing) {
// //       return NextResponse.json({ error: "User already exists" }, { status: 400 });
// //     }

// //     const saltRounds = 10;
// //     const passwordHash = await bcrypt.hash(password, saltRounds);

// //     const newUser = await User.create({
// //       email,
// //       passwordHash,
// //       role: role || "editor", // default role if none provided
// //     });

// //     return NextResponse.json({ message: "User registered", userId: newUser._id });
// //   } catch (err) {
// //     console.error("Register error:", err);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }
