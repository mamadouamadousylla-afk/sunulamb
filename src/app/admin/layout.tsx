import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Sidebar from "@/components/admin/Sidebar"
import Header from "@/components/admin/Header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}