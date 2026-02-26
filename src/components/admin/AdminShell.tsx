"use client"

import AdminSidebar from "./AdminSidebar"

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b1120]">
      <AdminSidebar />
      <div className="ml-64 transition-all duration-300">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
