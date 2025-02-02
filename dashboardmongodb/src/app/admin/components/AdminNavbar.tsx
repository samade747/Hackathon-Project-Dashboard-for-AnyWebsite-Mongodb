// src/app/admin/components/AdminNavbar.tsx
"use client";

import React, { Dispatch, SetStateAction } from "react";
import { FaBars } from "react-icons/fa";

interface AdminNavbarProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AdminNavbar({ setSidebarOpen }: AdminNavbarProps) {
  const handleLogout = () => {
    // Insert your real logout logic here
    alert("Logged out!");
  };

  const UserhandleLogout = () => {
    // Insert your real logout logic here
    alert("updating!");
  };

  const cohandleLogout = () => {
    // Insert your real logout logic here
    alert("+923328222026 contact now!");
  };

  return (
    <header className="bg-white shadow px-4 py-3 gap-2 flex items-center justify-between">
      {/* Left: Hamburger (visible on small screens only) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden text-gray-600 hover:text-gray-800"
      >
        <FaBars className="h-6 w-6" />
      </button>

      {/* Center: Title or brand */}
      <div className="font-semibold text-xl">Admin Panel</div>

       {/* Right: Actions (like logout) */}
       <div>
        <button
          onClick={cohandleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Connect with your website(paid)
        </button>
      </div>


       {/* Right: Actions (like logout) */}
       <div>
        <button
          onClick={UserhandleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          User Manual
        </button>
      </div>

      {/* Right: Actions (like logout) */}
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

