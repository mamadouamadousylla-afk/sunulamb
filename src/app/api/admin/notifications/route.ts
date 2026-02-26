import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let notifications, total

    if (type) {
      notifications = await sql`
        SELECT n.*, u.full_name as user_name
        FROM notifications n
        LEFT JOIN users u ON n.user_id = u.id
        WHERE n.type = ${type}
        ORDER BY n.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM notifications WHERE type = ${type}`
    } else {
      notifications = await sql`
        SELECT n.*, u.full_name as user_name
        FROM notifications n
        LEFT JOIN users u ON n.user_id = u.id
        ORDER BY n.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM notifications`
    }

    return NextResponse.json({ notifications, total, page, limit })
  } catch (error) {
    console.error("Notifications list error:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, title, message, type } = body

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 })
    }

    if (user_id) {
      const [notification] = await sql`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (${user_id}, ${title}, ${message}, ${type || 'info'})
        RETURNING *
      `
      return NextResponse.json(notification, { status: 201 })
    } else {
      // Broadcast to all users
      const users = await sql`SELECT id FROM users WHERE is_banned = false`
      for (const user of users) {
        await sql`
          INSERT INTO notifications (user_id, title, message, type)
          VALUES (${user.id}, ${title}, ${message}, ${type || 'info'})
        `
      }
      return NextResponse.json({ success: true, sent_to: users.length }, { status: 201 })
    }
  } catch (error) {
    console.error("Create notification error:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
