"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Register failed");
        return;
      }
      alert("User created!");
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register Admin/User</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            className="border rounded w-full px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            className="border rounded w-full px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Role</label>
          <select
            className="border rounded w-full px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="editor">editor</option>
            <option value="orderer">orderer</option>
            <option value="accountant">accountant</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          className="bg-black text-white w-full py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}
