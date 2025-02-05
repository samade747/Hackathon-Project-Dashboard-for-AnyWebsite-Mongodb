// eslint-disable-next-line @typescript-eslint/no-explicit-any

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState(""); // Optional
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("orderer"); // Default role
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    // Basic validation before making request
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      // Construct request body (omit username if empty)
      const requestBody: any = { email, password, role };
      if (username.trim()) requestBody.username = username.trim();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      alert("Registered successfully!");
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register Admin/User</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        {/* Username Field (Optional) */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username (Optional)</label>
          <input
            className="border rounded w-full px-3 py-2"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a unique username"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            className="border rounded w-full px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            className="border rounded w-full px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a strong password"
            required
          />
        </div>

        {/* Role Select Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Role</label>
          <select
            className="border rounded w-full px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="editor">Editor</option>
            <option value="orderer">Orderer</option>
            <option value="accountant">Accountant</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}


// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminRegisterPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState(""); // Optional
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("orderer"); // Default to "orderer"
//   const [error, setError] = useState("");

//   const handleRegister = async () => {
//     setError("");

//     // Basic validation before making request
//     if (!email.trim() || !password.trim()) {
//       setError("Email and password are required.");
//       return;
//     }

//     try {
//       // Construct request body (omit username if empty)
//       const requestBody: any = { email, password, role };
//       if (username.trim()) requestBody.username = username;

//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Registration failed");
//         return;
//       }

//       alert("Registered successfully!");
//       router.push("/admin/dashboard");
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-200">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4">Register Admin/User</h2>
//         {error && <p className="text-red-600 mb-2">{error}</p>}

//         {/* Username Field (Optional) */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Username (Optional)</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Enter a unique username"
//           />
//         </div>

//         {/* Email Field */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Email</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             required
//           />
//         </div>

//         {/* Password Field */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Password</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Choose a strong password"
//             required
//           />
//         </div>

//         {/* Role Select Dropdown */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Role</label>
//           <select
//             className="border rounded w-full px-3 py-2"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="admin">Admin</option>
//             <option value="manager">Manager</option>
//             <option value="editor">Editor</option>
//             <option value="orderer">Orderer</option>
//             <option value="accountant">Accountant</option>
//           </select>
//         </div>

//         <button
//           onClick={handleRegister}
//           className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 transition"
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminRegisterPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("orderer"); // Default to "orderer"
//   const [error, setError] = useState("");

//   const handleRegister = async () => {
//     setError("");

//     // Basic validation on frontend before making request
//     if (!username.trim() || !email.trim() || !password.trim()) {
//       setError("All fields are required!");
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, email, password, role }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Registration failed");
//         return;
//       }

//       alert("Registered successfully!");
//       router.push("/admin/dashboard");
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-200">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4">Register Admin/User</h2>
//         {error && <p className="text-red-600 mb-2">{error}</p>}

//         {/* Username Field */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Username</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Enter a unique username"
//           />
//         </div>

//         {/* Email Field */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Email</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//           />
//         </div>

//         {/* Password Field */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Password</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Choose a strong password"
//           />
//         </div>

//         {/* Role Select Dropdown */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Role</label>
//           <select
//             className="border rounded w-full px-3 py-2"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="admin">Admin</option>
//             <option value="manager">Manager</option>
//             <option value="editor">Editor</option>
//             <option value="orderer">Orderer</option>
//             <option value="accountant">Accountant</option>
//           </select>
//         </div>

//         <button
//           onClick={handleRegister}
//           className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 transition"
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminRegisterPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("editor");
//   const [error, setError] = useState("");

//   const handleRegister = async () => {
//     setError("");
//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, role }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.error || "Registration failed");
//         return;
//       }
//       alert("Registered!");
//       router.push("/admin/dashboard");
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-200">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4">Admin Register</h2>
//         {error && <p className="text-red-600 mb-2">{error}</p>}

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Email</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Password</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         {/* role select */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Role</label>
//           <select
//             className="border rounded w-full px-3 py-2"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="admin">Admin</option>
//             <option value="manager">Manager</option>
//             <option value="editor">Editor</option>
//             <option value="orderer">Orderer</option>
//             <option value="accountant">Accountant</option>
//           </select>
//         </div>

//         <button
//           onClick={handleRegister}
//           className="bg-black text-white w-full py-2 rounded"
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// }


// // "use client";

// // import React, { useState } from "react";
// // import { useRouter } from "next/navigation";

// // export default function AdminRegisterPage() {
// //   const router = useRouter();
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [role, setRole] = useState("editor");
// //   const [error, setError] = useState("");

// //   const handleRegister = async () => {
// //     setError("");
// //     try {
// //       const res = await fetch("/api/auth/register", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password, role }),
// //       });
// //       const data = await res.json();
// //       if (!res.ok) {
// //         setError(data.error || "Registration failed");
// //         return;
// //       }
// //       alert("Registered!");
// //       router.push("/admin/dashboard");
// //     } catch (err) {
// //       console.error(err);
// //       setError("Something went wrong");
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center h-screen bg-gray-200">
// //       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
// //         <h2 className="text-2xl font-bold mb-4">Admin Register</h2>
// //         {error && <p className="text-red-600 mb-2">{error}</p>}

// //         <div className="mb-4">
// //           <label className="block mb-1 font-medium">Email</label>
// //           <input
// //             className="border rounded w-full px-3 py-2"
// //             type="email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //           />
// //         </div>

// //         <div className="mb-4">
// //           <label className="block mb-1 font-medium">Password</label>
// //           <input
// //             className="border rounded w-full px-3 py-2"
// //             type="password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //           />
// //         </div>

// //         {/* role select */}
// //         <div className="mb-4">
// //           <label className="block mb-1 font-medium">Role</label>
// //           <select
// //             className="border rounded w-full px-3 py-2"
// //             value={role}
// //             onChange={(e) => setRole(e.target.value)}
// //           >
// //             <option value="admin">Admin</option>
// //             <option value="manager">Manager</option>
// //             <option value="editor">Editor</option>
// //             <option value="orderer">Orderer</option>
// //             <option value="accountant">Accountant</option>
// //           </select>
// //         </div>

// //         <button
// //           onClick={handleRegister}
// //           className="bg-black text-white w-full py-2 rounded"
// //         >
// //           Register
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// // "use client";

// // import React, { useState } from "react";
// // import { useRouter } from "next/navigation";

// // export default function AdminRegisterPage() {
// //   const router = useRouter();
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [role, setRole] = useState("editor");
// //   const [error, setError] = useState("");

// //   const handleRegister = async () => {
// //     setError("");
// //     try {
// //       const res = await fetch("/api/auth/register", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password, role }),
// //       });
// //       const data = await res.json();
// //       if (!res.ok) {
// //         setError(data.error || "Registration failed");
// //         return;
// //       }
// //       alert("Registered!");
// //       router.push("/admin/dashboard");
// //     } catch (err) {
// //       console.error(err);
// //       setError("Something went wrong");
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center h-screen bg-gray-200">
// //       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
// //         <h2 className="text-2xl font-bold mb-4">Admin Register</h2>
// //         {error && <p className="text-red-600 mb-2">{error}</p>}

// //         <div className="mb-4">
// //           <label className="block mb-1 font-medium">Email</label>
// //           <input
// //             className="border rounded w-full px-3 py-2"
// //             type="email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //           />
// //         </div>

// //         <div className="mb-4">
// //           <label className="block mb-1 font-medium">Password</label>
// //           <input
// //             className="border rounded w-full px-3 py-2"
// //             type="password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //           />
// //         </div>

// //         {/* role select */}
// //         <div className="mb-4">
// //           <label className="block mb-1 font-medium">Role</label>
// //           <select
// //             className="border rounded w-full px-3 py-2"
// //             value={role}
// //             onChange={(e) => setRole(e.target.value)}
// //           >
// //             <option value="admin">Admin</option>
// //             <option value="manager">Manager</option>
// //             <option value="editor">Editor</option>
// //             <option value="orderer">Orderer</option>
// //             <option value="accountant">Accountant</option>
// //           </select>
// //         </div>

// //         <button
// //           onClick={handleRegister}
// //           className="bg-black text-white w-full py-2 rounded"
// //         >
// //           Register
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
