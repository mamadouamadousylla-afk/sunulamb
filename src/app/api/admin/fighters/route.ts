import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let fighters, total

    if (search) {
      fighters = await sql`
        SELECT f.*,
          (SELECT COUNT(*)::int FROM event_fighters WHERE fighter_id = f.id) as total_fights
        FROM fighters f
        WHERE f.name ILIKE ${'%' + search + '%'} OR f.nickname ILIKE ${'%' + search + '%'} OR f.ecurie ILIKE ${'%' + search + '%'}
        ORDER BY f.name ASC
        LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`
        SELECT COUNT(*)::int as count FROM fighters
        WHERE name ILIKE ${'%' + search + '%'} OR nickname ILIKE ${'%' + search + '%'} OR ecurie ILIKE ${'%' + search + '%'}
      `
    } else {
      fighters = await sql`
        SELECT f.*,
          (SELECT COUNT(*)::int FROM event_fighters WHERE fighter_id = f.id) as total_fights
        FROM fighters f
        ORDER BY f.name ASC
        LIMIT ${limit} OFFSET ${offset}
      `
      ;[{ count: total }] = await sql`SELECT COUNT(*)::int as count FROM fighters`
    }

    return NextResponse.json({ fighters, total, page, limit })
  } catch (error) {
    console.error("Fighters list error:", error)
    return NextResponse.json({ error: "Failed to fetch fighters" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, nickname, wins, losses, height, weight, image_url, bio, ecurie } = body

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

    const [fighter] = await sql`
      INSERT INTO fighters (name, nickname, wins, losses, height, weight, image_url, bio, ecurie)
      VALUES (${name}, ${nickname || null}, ${wins || 0}, ${losses || 0}, ${height || null}, ${weight || null}, ${image_url || null}, ${bio || null}, ${ecurie || null})
      RETURNING *
    `

    return NextResponse.json(fighter, { status: 201 })
  } catch (error) {
    console.error("Create fighter error:", error)
    return NextResponse.json({ error: "Failed to create fighter" }, { status: 500 })
  }
}
