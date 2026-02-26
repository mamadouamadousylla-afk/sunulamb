"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Plus, Search, Calendar, MapPin, Ticket, Trash2, Edit, Eye } from "lucide-react"

interface Event {
  id: number; title: string; date: string; time: string; location: string;
  status: string; category: string; image_url: string; is_featured: boolean;
  arena_name: string; tickets_sold: number; total_capacity: number
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-emerald-500/15 text-emerald-400",
    draft: "bg-slate-500/15 text-slate-400",
    cancelled: "bg-red-500/15 text-red-400",
    completed: "bg-blue-500/15 text-blue-400",
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-slate-500/15 text-slate-400"}`}>
      {status}
    </span>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: page.toString(), limit: "15" })
    if (search) params.set("search", search)
    if (statusFilter) params.set("status", statusFilter)
    try {
      const res = await fetch(`/api/admin/events?${params}`)
      const data = await res.json()
      setEvents(data.events || [])
      setTotal(data.total || 0)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [page, search, statusFilter])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet evenement ?")) return
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" })
    fetchEvents()
  }

  const totalPages = Math.ceil(total / 15)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Evenements</h1>
          <p className="text-sm text-slate-400 mt-1">{total} evenement(s) au total</p>
        </div>
        <Link
          href="/admin/evenements/nouveau"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouvel evenement
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un evenement..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publie</option>
          <option value="completed">Termine</option>
          <option value="cancelled">Annule</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500">Aucun evenement trouve</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Evenement</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Lieu</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tickets</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-[200px]">{event.title}</p>
                          {event.category && <p className="text-xs text-slate-500 mt-0.5">{event.category}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      {event.time && <span className="text-slate-500 ml-1">{event.time}</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]">{event.arena_name || event.location || "-"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Ticket className="w-3.5 h-3.5 text-slate-500" />
                        {event.tickets_sold}/{event.total_capacity || "?"}
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={event.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/evenements/${event.id}`} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors" title="Voir">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/evenements/${event.id}/modifier`} className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Precedent
          </button>
          <span className="text-sm text-slate-400">Page {page} sur {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}
