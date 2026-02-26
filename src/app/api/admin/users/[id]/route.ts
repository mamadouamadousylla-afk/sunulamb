import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [user] = await sql`SELECT * FROM users WHERE id = ${id}`
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const tickets = await sql`
      SELECT t.*, e.title as event_title, tc.name as category_name
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.id
      LEFT JOIN ticket_categories tc ON t.category_id = tc.id
      WHERE t.user_id = ${id}
      ORDER BY t.created_at DESC
    `

    const payments = await sql`
      SELECT * FROM payments WHERE user_id = ${id} ORDER BY created_at DESC
    `

    return NextResponse.json({ ...user, tickets, payments })
  } catch (error) {
    console.error("User detail error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { full_name, phone, email, points, level, is_banned } = body

    const [user] = await sql`
      UPDATE users SET
        full_name = COALESCE(${full_name}, full_name),
        phone = COALESCE(${phone}, phone),
        email = COALESCE(${email}, email),
        points = COALESCE(${points}, points),
        level = COALESCE(${level}, level),
        is_banned = COALESCE(${is_banned}, is_banned),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
