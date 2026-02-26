import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [event] = await sql`
      SELECT e.*, a.name as arena_name
      FROM events e
      LEFT JOIN arenas a ON e.arena_id = a.id
      WHERE e.id = ${id}
    `
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 })

    const fighters = await sql`
      SELECT f.*, ef.corner
      FROM event_fighters ef
      JOIN fighters f ON ef.fighter_id = f.id
      WHERE ef.event_id = ${id}
      ORDER BY ef.corner
    `

    const categories = await sql`
      SELECT * FROM ticket_categories WHERE event_id = ${id} ORDER BY price ASC
    `

    const ticketStats = await sql`
      SELECT status, COUNT(*)::int as count FROM tickets WHERE event_id = ${id} GROUP BY status
    `

    return NextResponse.json({ ...event, fighters, categories, ticketStats })
  } catch (error) {
    console.error("Event detail error:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, date, time, location, address, description, image_url, status, category, is_featured, arena_id } = body

    const [event] = await sql`
      UPDATE events SET
        title = COALESCE(${title}, title),
        date = COALESCE(${date}, date),
        time = COALESCE(${time}, time),
        location = COALESCE(${location}, location),
        address = COALESCE(${address}, address),
        description = COALESCE(${description}, description),
        image_url = COALESCE(${image_url}, image_url),
        status = COALESCE(${status}, status),
        category = COALESCE(${category}, category),
        is_featured = COALESCE(${is_featured}, is_featured),
        arena_id = COALESCE(${arena_id}, arena_id),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    return NextResponse.json(event)
  } catch (error) {
    console.error("Update event error:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [event] = await sql`DELETE FROM events WHERE id = ${id} RETURNING id`
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete event error:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
