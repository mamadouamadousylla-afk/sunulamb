import { db } from "@/lib/db"
import EventManagementTable from "@/components/admin/EventManagementTable"

export default async function EventsPage() {
  // Mock events data
  const events = [
    { 
      id: "1", 
      title: "Modou Lô vs Sa Thiès", 
      date: new Date("2024-04-05"), 
      location: "Arène Nationale de Lutte", 
      totalTickets: 2000, 
      availableTickets: 1200,
      status: "scheduled",
      organizer: { name: "SunuLamb Events" }
    },
    { 
      id: "2", 
      title: "Balla Gaye 2 vs Yékini", 
      date: new Date("2024-04-12"), 
      location: "Grand Arena", 
      totalTickets: 1500, 
      availableTickets: 350,
      status: "scheduled",
      organizer: { name: "Combat Sénégal" }
    },
    { 
      id: "3", 
      title: "Eumeu Sène vs Thiès", 
      date: new Date("2024-04-19"), 
      location: "Stade Omnisports", 
      totalTickets: 1000, 
      availableTickets: 0,
      status: "sold_out",
      organizer: { name: "Lutte Pro" }
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des événements</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
          Créer un événement
        </button>
      </div>

      <EventManagementTable events={events} />
    </div>
  )
}