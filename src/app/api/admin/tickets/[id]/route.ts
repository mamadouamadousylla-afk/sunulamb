import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !["valid", "used", "cancelled", "expired"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const [ticket] = await sql`
      UPDATE tickets SET status = ${status} WHERE id = ${id} RETURNING *
    `

    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Update ticket error:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}
