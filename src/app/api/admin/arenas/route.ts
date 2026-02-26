import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const arenas = await sql`
      SELECT a.*,
        (SELECT COUNT(*)::int FROM events WHERE arena_id = a.id) as total_events
      FROM arenas a
      ORDER BY a.name ASC
    `
    return NextResponse.json({ arenas })
  } catch (error) {
    console.error("Arenas list error:", error)
    return NextResponse.json({ error: "Failed to fetch arenas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, city, latitude, longitude, capacity, image_url } = body

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

    const [arena] = await sql`
      INSERT INTO arenas (name, address, city, latitude, longitude, capacity, image_url)
      VALUES (${name}, ${address || null}, ${city || null}, ${latitude || null}, ${longitude || null}, ${capacity || 0}, ${image_url || null})
      RETURNING *
    `

    return NextResponse.json(arena, { status: 201 })
  } catch (error) {
    console.error("Create arena error:", error)
    return NextResponse.json({ error: "Failed to create arena" }, { status: 500 })
  }
}
