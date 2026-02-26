import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const [eventsCount] = await sql`SELECT COUNT(*)::int as count FROM events`
    const [fightersCount] = await sql`SELECT COUNT(*)::int as count FROM fighters`
    const [usersCount] = await sql`SELECT COUNT(*)::int as count FROM users`
    const [ticketsCount] = await sql`SELECT COUNT(*)::int as count FROM tickets`
    const [arenasCount] = await sql`SELECT COUNT(*)::int as count FROM arenas`

    const [revenue] = await sql`SELECT COALESCE(SUM(amount), 0)::int as total FROM payments WHERE status = 'completed'`
    const [ticketsSold] = await sql`SELECT COUNT(*)::int as count FROM tickets WHERE status IN ('valid', 'used')`
    const [pendingPayments] = await sql`SELECT COUNT(*)::int as count FROM payments WHERE status = 'pending'`

    const recentPayments = await sql`
      SELECT p.*, u.full_name as user_name, e.title as event_title
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN tickets t ON p.ticket_id = t.id
      LEFT JOIN events e ON t.event_id = e.id
      ORDER BY p.created_at DESC LIMIT 5
    `

    const upcomingEvents = await sql`
      SELECT e.*, a.name as arena_name,
        (SELECT COUNT(*)::int FROM tickets WHERE event_id = e.id) as tickets_sold
      FROM events e
      LEFT JOIN arenas a ON e.arena_id = a.id
      WHERE e.date >= CURRENT_DATE AND e.status != 'cancelled'
      ORDER BY e.date ASC LIMIT 5
    `

    const monthlyRevenue = await sql`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        SUM(amount)::int as revenue,
        COUNT(*)::int as transactions
      FROM payments 
      WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month ASC
    `

    const ticketsByStatus = await sql`
      SELECT status, COUNT(*)::int as count FROM tickets GROUP BY status
    `

    return NextResponse.json({
      counts: {
        events: eventsCount.count,
        fighters: fightersCount.count,
        users: usersCount.count,
        tickets: ticketsCount.count,
        arenas: arenasCount.count,
      },
      revenue: revenue.total,
      ticketsSold: ticketsSold.count,
      pendingPayments: pendingPayments.count,
      recentPayments,
      upcomingEvents,
      monthlyRevenue,
      ticketsByStatus,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
