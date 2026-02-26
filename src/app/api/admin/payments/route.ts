import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const method = searchParams.get("method")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let payments, total

    if (status && method) {
      payments = await sql`
        SELECT p.*, u.full_name as user_name, e.title as event_title
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN tickets t ON p.ticket_id = t.id
        LEFT JOIN events e ON t.event_id = e.id
        WHERE p.status = ${status} AND p.method = ${method}
        ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM payments WHERE status = ${status} AND method = ${method}`
    } else if (status) {
      payments = await sql`
        SELECT p.*, u.full_name as user_name, e.title as event_title
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN tickets t ON p.ticket_id = t.id
        LEFT JOIN events e ON t.event_id = e.id
        WHERE p.status = ${status}
        ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM payments WHERE status = ${status}`
    } else if (method) {
      payments = await sql`
        SELECT p.*, u.full_name as user_name, e.title as event_title
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN tickets t ON p.ticket_id = t.id
        LEFT JOIN events e ON t.event_id = e.id
        WHERE p.method = ${method}
        ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM payments WHERE method = ${method}`
    } else {
      payments = await sql`
        SELECT p.*, u.full_name as user_name, e.title as event_title
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN tickets t ON p.ticket_id = t.id
        LEFT JOIN events e ON t.event_id = e.id
        ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM payments`
    }

    return NextResponse.json({ payments, total, page, limit })
  } catch (error) {
    console.error("Payments list error:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}
