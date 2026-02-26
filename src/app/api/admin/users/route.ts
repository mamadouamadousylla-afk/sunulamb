import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let users, total

    if (search) {
      users = await sql`
        SELECT u.*,
          (SELECT COUNT(*)::int FROM tickets WHERE user_id = u.id) as total_tickets,
          (SELECT COALESCE(SUM(amount), 0)::int FROM payments WHERE user_id = u.id AND status = 'completed') as total_spent
        FROM users u
        WHERE u.full_name ILIKE ${'%' + search + '%'} OR u.email ILIKE ${'%' + search + '%'} OR u.phone ILIKE ${'%' + search + '%'}
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`
        SELECT COUNT(*)::int as count FROM users
        WHERE full_name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'} OR phone ILIKE ${'%' + search + '%'}
      `
    } else {
      users = await sql`
        SELECT u.*,
          (SELECT COUNT(*)::int FROM tickets WHERE user_id = u.id) as total_tickets,
          (SELECT COALESCE(SUM(amount), 0)::int FROM payments WHERE user_id = u.id AND status = 'completed') as total_spent
        FROM users u
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM users`
    }

    return NextResponse.json({ users, total, page, limit })
  } catch (error) {
    console.error("Users list error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
