import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, address, city, latitude, longitude, capacity, image_url, is_active } = body

    const [arena] = await sql`
      UPDATE arenas SET
        name = COALESCE(${name}, name),
        address = COALESCE(${address}, address),
        city = COALESCE(${city}, city),
        latitude = COALESCE(${latitude}, latitude),
        longitude = COALESCE(${longitude}, longitude),
        capacity = COALESCE(${capacity}, capacity),
        image_url = COALESCE(${image_url}, image_url),
        is_active = COALESCE(${is_active}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (!arena) return NextResponse.json({ error: "Arena not found" }, { status: 404 })
    return NextResponse.json(arena)
  } catch (error) {
    console.error("Update arena error:", error)
    return NextResponse.json({ error: "Failed to update arena" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [arena] = await sql`DELETE FROM arenas WHERE id = ${id} RETURNING id`
    if (!arena) return NextResponse.json({ error: "Arena not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete arena error:", error)
    return NextResponse.json({ error: "Failed to delete arena" }, { status: 500 })
  }
}
