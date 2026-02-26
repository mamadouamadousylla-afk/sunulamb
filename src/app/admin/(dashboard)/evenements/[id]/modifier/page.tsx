"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

interface Arena { id: number; name: string }

export default function EditEventPage() {
  const { id } = useParams()
  const router = useRouter()
  const [arenas, setArenas] = useState<Arena[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: "", date: "", time: "", location: "", address: "",
    description: "", image_url: "", status: "draft", category: "Lutte avec frappe",
    is_featured: false, arena_id: "",
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/events/${id}`).then(r => r.json()),
      fetch("/api/admin/arenas").then(r => r.json()),
    ]).then(([event, arenasData]) => {
      setArenas(arenasData.arenas || [])
      setForm({
        title: event.title || "",
        date: event.date ? event.date.split("T")[0] : "",
        time: event.time || "",
        location: event.location || "",
        address: event.address || "",
        description: event.description || "",
        image_url: event.image_url || "",
        status: event.status || "draft",
        category: event.category || "Lutte avec frappe",
        is_featured: event.is_featured || false,
        arena_id: event.arena_id?.toString() || "",
      })
      setLoading(false)
    })
  }, [id])

  function updateField(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, arena_id: form.arena_id ? parseInt(form.arena_id) : null }),
      })
      if (res.ok) router.push(`/admin/evenements/${id}`)
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Modifier l{"'"}evenement</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Titre *</label>
            <input type="text" required value={form.title} onChange={e => updateField("title", e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Date *</label>
              <input type="date" required value={form.date} onChange={e => updateField("date", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Heure</label>
              <input type="text" value={form.time} onChange={e => updateField("time", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" placeholder="Ex: 16h00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Categorie</label>
              <select value={form.category} onChange={e => updateField("category", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50">
                <option value="Lutte avec frappe">Lutte avec frappe</option>
                <option value="Gala de lutte">Gala de lutte</option>
                <option value="Lutte simple">Lutte simple</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Statut</label>
              <select value={form.status} onChange={e => updateField("status", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50">
                <option value="draft">Brouillon</option>
                <option value="published">Publie</option>
                <option value="cancelled">Annule</option>
                <option value="completed">Termine</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Arene</label>
            <select value={form.arena_id} onChange={e => updateField("arena_id", e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50">
              <option value="">Selectionner une arene</option>
              {arenas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Lieu</label>
              <input type="text" value={form.location} onChange={e => updateField("location", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Adresse</label>
              <input type="text" value={form.address} onChange={e => updateField("address", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea rows={4} value={form.description} onChange={e => updateField("description", e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">URL Image</label>
            <input type="url" value={form.image_url} onChange={e => updateField("image_url", e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => updateField("is_featured", e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500/50" />
            <span className="text-sm text-slate-300">Mettre en vedette</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
            <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Sauvegarder"}
          </button>
        </div>
      </form>
    </div>
  )
}
