"use client";

import React, { Dispatch, SetStateAction } from "react";
import { FaBars } from "react-icons/fa";

interface AdminNavbarProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AdminNavbar({ setSidebarOpen }: AdminNavbarProps) {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      alert("Logged out successfully");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-white shadow px-4 py-3 gap-2 flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden text-gray-600 hover:text-gray-800"
      >
        <FaBars className="h-6 w-6" />
      </button>
      <div className="font-semibold text-xl">Admin Panel</div>
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
