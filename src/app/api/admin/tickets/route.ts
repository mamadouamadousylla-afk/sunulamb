import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const eventId = searchParams.get("event_id")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const values: (string | number)[] = []

    let whereClause = ""
    if (status) { conditions.push(`t.status = '${status}'`) }
    if (eventId) { conditions.push(`t.event_id = ${parseInt(eventId)}`) }
    if (search) { conditions.push(`(t.ticket_number ILIKE '%${search}%' OR u.full_name ILIKE '%${search}%')`) }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ")
    }

    // Use parameterized queries with conditional logic
    let tickets, total

    if (status && eventId && search) {
      tickets = await sql`
        SELECT t.*, u.full_name as user_name, u.phone as user_phone, e.title as event_title, tc.name as category_name, tc.price
        FROM tickets t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN events e ON t.event_id = e.id
        LEFT JOIN ticket_categories tc ON t.category_id = tc.id
        WHERE t.status = ${status} AND t.event_id = ${parseInt(eventId)} AND (t.ticket_number ILIKE ${'%' + search + '%'} OR u.full_name ILIKE ${'%' + search + '%'})
        ORDER BY t.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`
        SELECT COUNT(*)::int as count FROM tickets t LEFT JOIN users u ON t.user_id = u.id
        WHERE t.status = ${status} AND t.event_id = ${parseInt(eventId)} AND (t.ticket_number ILIKE ${'%' + search + '%'} OR u.full_name ILIKE ${'%' + search + '%'})
      `
    } else if (status && eventId) {
      tickets = await sql`
        SELECT t.*, u.full_name as user_name, u.phone as user_phone, e.title as event_title, tc.name as category_name, tc.price
        FROM tickets t LEFT JOIN users u ON t.user_id = u.id LEFT JOIN events e ON t.event_id = e.id LEFT JOIN ticket_categories tc ON t.category_id = tc.id
        WHERE t.status = ${status} AND t.event_id = ${parseInt(eventId)}
        ORDER BY t.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM tickets WHERE status = ${status} AND event_id = ${parseInt(eventId)}`
    } else if (status) {
      tickets = await sql`
        SELECT t.*, u.full_name as user_name, u.phone as user_phone, e.title as event_title, tc.name as category_name, tc.price
        FROM tickets t LEFT JOIN users u ON t.user_id = u.id LEFT JOIN events e ON t.event_id = e.id LEFT JOIN ticket_categories tc ON t.category_id = tc.id
        WHERE t.status = ${status}
        ORDER BY t.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM tickets WHERE status = ${status}`
    } else if (eventId) {
      tickets = await sql`
        SELECT t.*, u.full_name as user_name, u.phone as user_phone, e.title as event_title, tc.name as category_name, tc.price
        FROM tickets t LEFT JOIN users u ON t.user_id = u.id LEFT JOIN events e ON t.event_id = e.id LEFT JOIN ticket_categories tc ON t.category_id = tc.id
        WHERE t.event_id = ${parseInt(eventId)}
        ORDER BY t.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM tickets WHERE event_id = ${parseInt(eventId)}`
    } else if (search) {
      tickets = await sql`
        SELECT t.*, u.full_name as user_name, u.phone as user_phone, e.title as event_title, tc.name as category_name, tc.price
        FROM tickets t LEFT JOIN users u ON t.user_id = u.id LEFT JOIN events e ON t.event_id = e.id LEFT JOIN ticket_categories tc ON t.category_id = tc.id
        WHERE t.ticket_number ILIKE ${'%' + search + '%'} OR u.full_name ILIKE ${'%' + search + '%'}
        ORDER BY t.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`
        SELECT COUNT(*)::int as count FROM tickets t LEFT JOIN users u ON t.user_id = u.id
        WHERE t.ticket_number ILIKE ${'%' + search + '%'} OR u.full_name ILIKE ${'%' + search + '%'}
      `
    } else {
      tickets = await sql`
        SELECT t.*, u.full_name as user_name, u.phone as user_phone, e.title as event_title, tc.name as category_name, tc.price
        FROM tickets t LEFT JOIN users u ON t.user_id = u.id LEFT JOIN events e ON t.event_id = e.id LEFT JOIN ticket_categories tc ON t.category_id = tc.id
        ORDER BY t.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM tickets`
    }

    return NextResponse.json({ tickets, total, page, limit })
  } catch (error) {
    console.error("Tickets list error:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}
