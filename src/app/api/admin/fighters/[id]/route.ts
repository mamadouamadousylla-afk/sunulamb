import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [fighter] = await sql`SELECT * FROM fighters WHERE id = ${id}`
    if (!fighter) return NextResponse.json({ error: "Fighter not found" }, { status: 404 })

    const events = await sql`
      SELECT e.title, e.date, e.status, ef.corner
      FROM event_fighters ef
      JOIN events e ON ef.event_id = e.id
      WHERE ef.fighter_id = ${id}
      ORDER BY e.date DESC
    `

    return NextResponse.json({ ...fighter, events })
  } catch (error) {
    console.error("Fighter detail error:", error)
    return NextResponse.json({ error: "Failed to fetch fighter" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, nickname, wins, losses, height, weight, image_url, bio, ecurie, is_active } = body

    const [fighter] = await sql`
      UPDATE fighters SET
        name = COALESCE(${name}, name),
        nickname = COALESCE(${nickname}, nickname),
        wins = COALESCE(${wins}, wins),
        losses = COALESCE(${losses}, losses),
        height = COALESCE(${height}, height),
        weight = COALESCE(${weight}, weight),
        image_url = COALESCE(${image_url}, image_url),
        bio = COALESCE(${bio}, bio),
        ecurie = COALESCE(${ecurie}, ecurie),
        is_active = COALESCE(${is_active}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (!fighter) return NextResponse.json({ error: "Fighter not found" }, { status: 404 })
    return NextResponse.json(fighter)
  } catch (error) {
    console.error("Update fighter error:", error)
    return NextResponse.json({ error: "Failed to update fighter" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [fighter] = await sql`DELETE FROM fighters WHERE id = ${id} RETURNING id`
    if (!fighter) return NextResponse.json({ error: "Fighter not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete fighter error:", error)
    return NextResponse.json({ error: "Failed to delete fighter" }, { status: 500 })
  }
}
