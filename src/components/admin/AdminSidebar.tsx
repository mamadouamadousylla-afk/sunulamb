"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Swords,
  Ticket,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navSections = [
  {
    title: "General",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    ],
  },
  {
    title: "Gestion",
    items: [
      { label: "Evenements", icon: Calendar, href: "/admin/evenements" },
      { label: "Lutteurs", icon: Swords, href: "/admin/lutteurs" },
      { label: "Arenes", icon: MapPin, href: "/admin/arenes" },
    ],
  },
  {
    title: "Billetterie",
    items: [
      { label: "Tickets", icon: Ticket, href: "/admin/tickets" },
      { label: "Paiements", icon: CreditCard, href: "/admin/paiements" },
    ],
  },
  {
    title: "Utilisateurs",
    items: [
      { label: "Utilisateurs", icon: Users, href: "/admin/utilisateurs" },
      { label: "Notifications", icon: Bell, href: "/admin/notifications" },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[#0f172a] border-r border-slate-800 flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600 shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white truncate">SunuLamb</h2>
            <p className="text-[10px] text-slate-500 truncate">Administration</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-emerald-600/15 text-emerald-400"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-emerald-400")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-3 space-y-2 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
          title={collapsed ? "Deconnexion" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Deconnexion</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}
