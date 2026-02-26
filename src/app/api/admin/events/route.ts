import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let events
    let total

    if (status && search) {
      events = await sql`
        SELECT e.*, a.name as arena_name,
          (SELECT COUNT(*)::int FROM tickets WHERE event_id = e.id) as tickets_sold,
          (SELECT COALESCE(SUM(tc.total_seats), 0)::int FROM ticket_categories tc WHERE tc.event_id = e.id) as total_capacity
        FROM events e
        LEFT JOIN arenas a ON e.arena_id = a.id
        WHERE e.status = ${status} AND (e.title ILIKE ${'%' + search + '%'} OR e.location ILIKE ${'%' + search + '%'})
        ORDER BY e.date DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`
        SELECT COUNT(*)::int as count FROM events
        WHERE status = ${status} AND (title ILIKE ${'%' + search + '%'} OR location ILIKE ${'%' + search + '%'})
      `
    } else if (status) {
      events = await sql`
        SELECT e.*, a.name as arena_name,
          (SELECT COUNT(*)::int FROM tickets WHERE event_id = e.id) as tickets_sold,
          (SELECT COALESCE(SUM(tc.total_seats), 0)::int FROM ticket_categories tc WHERE tc.event_id = e.id) as total_capacity
        FROM events e
        LEFT JOIN arenas a ON e.arena_id = a.id
        WHERE e.status = ${status}
        ORDER BY e.date DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM events WHERE status = ${status}`
    } else if (search) {
      events = await sql`
        SELECT e.*, a.name as arena_name,
          (SELECT COUNT(*)::int FROM tickets WHERE event_id = e.id) as tickets_sold,
          (SELECT COALESCE(SUM(tc.total_seats), 0)::int FROM ticket_categories tc WHERE tc.event_id = e.id) as total_capacity
        FROM events e
        LEFT JOIN arenas a ON e.arena_id = a.id
        WHERE e.title ILIKE ${'%' + search + '%'} OR e.location ILIKE ${'%' + search + '%'}
        ORDER BY e.date DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`
        SELECT COUNT(*)::int as count FROM events
        WHERE title ILIKE ${'%' + search + '%'} OR location ILIKE ${'%' + search + '%'}
      `
    } else {
      events = await sql`
        SELECT e.*, a.name as arena_name,
          (SELECT COUNT(*)::int FROM tickets WHERE event_id = e.id) as tickets_sold,
          (SELECT COALESCE(SUM(tc.total_seats), 0)::int FROM ticket_categories tc WHERE tc.event_id = e.id) as total_capacity
        FROM events e
        LEFT JOIN arenas a ON e.arena_id = a.id
        ORDER BY e.date DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM events`
    }

    return NextResponse.json({ events, total, page, limit })
  } catch (error) {
    console.error("Events list error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date, time, location, address, description, image_url, status, category, is_featured, arena_id } = body

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    const [event] = await sql`
      INSERT INTO events (title, slug, date, time, location, address, description, image_url, status, category, is_featured, arena_id)
      VALUES (${title}, ${slug}, ${date}, ${time || null}, ${location || null}, ${address || null}, ${description || null}, ${image_url || null}, ${status || 'draft'}, ${category || null}, ${is_featured || false}, ${arena_id || null})
      RETURNING *
    `

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Create event error:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
