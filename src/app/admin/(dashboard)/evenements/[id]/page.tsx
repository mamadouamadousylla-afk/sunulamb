"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Calendar, MapPin, Swords, Ticket, Users } from "lucide-react"

interface EventDetail {
  id: number; title: string; date: string; time: string; location: string; address: string;
  description: string; image_url: string; status: string; category: string; is_featured: boolean;
  arena_name: string;
  fighters: Array<{ id: number; name: string; nickname: string; corner: number; wins: number; losses: number }>;
  categories: Array<{ id: number; name: string; price: number; color: string; total_seats: number; available_seats: number }>;
  ticketStats: Array<{ status: string; count: number }>;
}

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-SN").format(amount) + " F CFA"
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-emerald-500/15 text-emerald-400",
    draft: "bg-slate-500/15 text-slate-400",
    cancelled: "bg-red-500/15 text-red-400",
    completed: "bg-blue-500/15 text-blue-400",
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-slate-500/15 text-slate-400"}`}>
      {status}
    </span>
  )
}

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/events/${id}`)
      .then((r) => r.json())
      .then(setEvent)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return <div className="text-center py-20 text-slate-400">Evenement introuvable</div>
  }

  const totalTickets = event.ticketStats.reduce((sum, t) => sum + t.count, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={event.status} />
              {event.category && <span className="text-xs text-slate-400">{event.category}</span>}
              {event.is_featured && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400">En vedette</span>}
            </div>
          </div>
        </div>
        <Link
          href={`/admin/evenements/${event.id}/modifier`}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Edit className="w-4 h-4" /> Modifier
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Informations</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="text-sm text-white">
                    {new Date(event.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    {event.time && ` a ${event.time}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Lieu</p>
                  <p className="text-sm text-white">{event.arena_name || event.location || "-"}</p>
                  {event.address && <p className="text-xs text-slate-500">{event.address}</p>}
                </div>
              </div>
            </div>
            {event.description && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-sm text-slate-300 leading-relaxed">{event.description}</p>
              </div>
            )}
          </div>

          {/* Fighters */}
          <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Swords className="w-4 h-4 text-amber-400" /> Combattants ({event.fighters.length})
            </h3>
            {event.fighters.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun combattant assigne</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.fighters.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${f.corner === 1 ? "bg-red-500/15 text-red-400" : "bg-blue-500/15 text-blue-400"}`}>
                      C{f.corner}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{f.name}</p>
                      <p className="text-xs text-slate-400">{f.nickname} - {f.wins}V / {f.losses}D</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Categories */}
          <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Ticket className="w-4 h-4 text-emerald-400" /> Billetterie
            </h3>
            <div className="space-y-2.5">
              {event.categories.length === 0 ? (
                <p className="text-sm text-slate-500">Aucune categorie</p>
              ) : (
                event.categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      {cat.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />}
                      <span className="text-sm text-white">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatCFA(cat.price)}</p>
                      <p className="text-xs text-slate-400">{cat.available_seats}/{cat.total_seats}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ticket Stats */}
          <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-purple-400" /> Ventes ({totalTickets} tickets)
            </h3>
            <div className="space-y-2">
              {event.ticketStats.map((t) => (
                <div key={t.status} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 capitalize">{t.status}</span>
                  <span className="text-white font-medium">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
