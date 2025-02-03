"use client";

import React, { useState } from "react";
import Sidebar from "../admin/components/Sidebar";
import AdminNavbar from "../admin/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />
        <main className="p-4 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
