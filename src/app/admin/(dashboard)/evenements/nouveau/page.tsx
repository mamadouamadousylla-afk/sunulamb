"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

interface Arena { id: number; name: string }

export default function NewEventPage() {
  const router = useRouter()
  const [arenas, setArenas] = useState<Arena[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "", date: "", time: "", location: "", address: "",
    description: "", image_url: "", status: "draft", category: "Lutte avec frappe",
    is_featured: false, arena_id: "",
  })

  useEffect(() => {
    fetch("/api/admin/arenas").then(r => r.json()).then(d => setArenas(d.arenas || []))
  }, [])

  function updateField(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, arena_id: form.arena_id ? parseInt(form.arena_id) : null }),
      })
      if (res.ok) {
        const event = await res.json()
        router.push(`/admin/evenements/${event.id}`)
      }
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Nouvel evenement</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Titre *</label>
            <input type="text" required value={form.title} onChange={e => updateField("title", e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" placeholder="Ex: Grand Combat de Dakar" />
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
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" placeholder="Nom du lieu" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Adresse</label>
              <input type="text" value={form.address} onChange={e => updateField("address", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" placeholder="Adresse complete" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea rows={4} value={form.description} onChange={e => updateField("description", e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none" placeholder="Description de l'evenement..." />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">URL Image</label>
            <input type="url" value={form.image_url} onChange={e => updateField("image_url", e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" placeholder="https://..." />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => updateField("is_featured", e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500/50" />
            <span className="text-sm text-slate-300">Mettre en vedette sur la page d{"'"}accueil</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
            <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Creer l'evenement"}
          </button>
        </div>
      </form>
    </div>
  )
}
