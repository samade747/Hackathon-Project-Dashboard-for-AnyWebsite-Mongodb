// app/admin/no-access/page.tsx
"use client";
import AdminNavbar from "@/app/admin/components/AdminNavbar";
import Sidebar from "@/app/admin/components/Sidebar";

export default function NoAccessPage() {
  return (
    <>
    <AdminNavbar  setSidebarOpen={() => {}} />
      <div className="flex min-h-screen">
    
    
      <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />
      
      <div className="flex-1 flex flex-col">
    
      <h1 className="text-2xl font-bold text-red-600">No Access</h1>
      <p>You do not have permission to access this page.</p>
      
    </div>
    </div>
    </>
  );
}
