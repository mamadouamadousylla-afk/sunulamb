"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  Users,
  Swords,
  Ticket,
  CreditCard,
  MapPin,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface Stats {
  counts: { events: number; fighters: number; users: number; tickets: number; arenas: number }
  revenue: number
  ticketsSold: number
  pendingPayments: number
  recentPayments: Array<{
    id: number; amount: number; method: string; status: string; created_at: string;
    user_name: string; event_title: string
  }>
  upcomingEvents: Array<{
    id: number; title: string; date: string; status: string; arena_name: string; tickets_sold: number
  }>
  ticketsByStatus: Array<{ status: string; count: number }>
}

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-SN").format(amount) + " F CFA"
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: "bg-emerald-500/15 text-emerald-400",
    pending: "bg-amber-500/15 text-amber-400",
    failed: "bg-red-500/15 text-red-400",
    refunded: "bg-blue-500/15 text-blue-400",
    published: "bg-emerald-500/15 text-emerald-400",
    draft: "bg-slate-500/15 text-slate-400",
    cancelled: "bg-red-500/15 text-red-400",
    valid: "bg-emerald-500/15 text-emerald-400",
    used: "bg-blue-500/15 text-blue-400",
    expired: "bg-slate-500/15 text-slate-400",
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-slate-500/15 text-slate-400"}`}>
      {status}
    </span>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-400">
        <AlertCircle className="w-5 h-5 mr-2" />
        Erreur de chargement des statistiques
      </div>
    )
  }

  const kpiCards = [
    { label: "Evenements", value: stats.counts.events, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10", href: "/admin/evenements" },
    { label: "Lutteurs", value: stats.counts.fighters, icon: Swords, color: "text-amber-400", bg: "bg-amber-500/10", href: "/admin/lutteurs" },
    { label: "Utilisateurs", value: stats.counts.users, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", href: "/admin/utilisateurs" },
    { label: "Tickets vendus", value: stats.ticketsSold, icon: Ticket, color: "text-emerald-400", bg: "bg-emerald-500/10", href: "/admin/tickets" },
    { label: "Revenus", value: formatCFA(stats.revenue), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", href: "/admin/paiements" },
    { label: "Arenes", value: stats.counts.arenas, icon: MapPin, color: "text-rose-400", bg: "bg-rose-500/10", href: "/admin/arenes" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Vue d{"'"}ensemble de la plateforme SunuLamb</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex items-center gap-4 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{card.label}</p>
              <p className="text-xl font-bold text-white">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Prochains evenements
            </h3>
            <Link href="/admin/evenements" className="text-xs text-emerald-400 hover:text-emerald-300">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-slate-700/50">
            {stats.upcomingEvents.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-500 text-center">Aucun evenement a venir</p>
            ) : (
              stats.upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/evenements/${event.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-700/20 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{event.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      {event.arena_name && ` - ${event.arena_name}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-slate-400">{event.tickets_sold} tickets</span>
                    <StatusBadge status={event.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" /> Derniers paiements
            </h3>
            <Link href="/admin/paiements" className="text-xs text-emerald-400 hover:text-emerald-300">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-slate-700/50">
            {stats.recentPayments.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-500 text-center">Aucun paiement recent</p>
            ) : (
              stats.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{payment.user_name || "Anonyme"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{payment.method} - {payment.event_title || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-sm font-semibold text-white">{formatCFA(payment.amount)}</span>
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tickets by status */}
      {stats.ticketsByStatus.length > 0 && (
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Tickets par statut</h3>
          <div className="flex flex-wrap gap-4">
            {stats.ticketsByStatus.map((item) => (
              <div key={item.status} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <StatusBadge status={item.status} />
                <span className="text-lg font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending payments alert */}
      {stats.pendingPayments > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-200">
            <span className="font-bold">{stats.pendingPayments}</span> paiement(s) en attente de validation.
            <Link href="/admin/paiements?status=pending" className="ml-1 text-amber-400 underline hover:text-amber-300">
              Voir les details
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
