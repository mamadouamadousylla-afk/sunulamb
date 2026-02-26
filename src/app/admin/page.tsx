import { auth } from "@/auth"
import { db } from "@/lib/db"
import StatCard from "@/components/admin/StatCard"
import RecentTransactions from "@/components/admin/RecentTransactions"
import EventPerformanceChart from "@/components/admin/EventPerformanceChart"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  // Fetch dashboard stats (using mock data for now)
  const totalUsers = 1245
  const totalEvents = 24
  const totalTicketsSold = 8432
  const totalRevenue = 12567000

  // Mock recent transactions
  const recentTransactions = [
    { id: "1", user: { name: "Jean Diop", email: "jean@example.com" }, event: { title: "Modou Lô vs Sa Thiès" }, amount: 15000, date: "2024-03-15", status: "completed" },
    { id: "2", user: { name: "Awa Fall", email: "awa@example.com" }, event: { title: "Balla Gaye 2 vs Yékini" }, amount: 30000, date: "2024-03-14", status: "completed" },
    { id: "3", user: { name: "Mamadou Sow", email: "mamadou@example.com" }, event: { title: "Eumeu Sène vs Thiès" }, amount: 10000, date: "2024-03-14", status: "pending" },
    { id: "4", user: { name: "Fatou Kane", email: "fatou@example.com" }, event: { title: "Modou Lô vs Sa Thiès" }, amount: 20000, date: "2024-03-13", status: "completed" },
    { id: "5", user: { name: "Ibra Diallo", email: "ibra@example.com" }, event: { title: "Balla Gaye 2 vs Yékini" }, amount: 5000, date: "2024-03-13", status: "failed" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500">Vue d'ensemble de votre plateforme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs"
          value={totalUsers.toString()}
          change="+12%"
          icon="👥"
        />
        <StatCard
          title="Événements"
          value={totalEvents.toString()}
          change="+5%"
          icon="🏟️"
        />
        <StatCard
          title="Tickets vendus"
          value={totalTicketsSold.toString()}
          change="+8%"
          icon="🎟️"
        />
        <StatCard
          title="Revenus"
          value={`${totalRevenue.toLocaleString('fr-FR')} FCFA`}
          change="+15%"
          icon="💰"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Transactions récentes</h2>
          <RecentTransactions transactions={recentTransactions} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Performance des événements</h2>
          <EventPerformanceChart />
        </div>
      </div>
    </div>
  )
}