import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createToken, setAdminCookie } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      )
    }

    const rows = await sql`
      SELECT id, email, name, role, password_hash 
      FROM admin_users 
      WHERE email = ${email} AND is_active = true
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      )
    }

    const admin = rows[0]
    const validPassword = await bcrypt.compare(password, admin.password_hash)

    if (!validPassword) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      )
    }

    // Update last login
    await sql`UPDATE admin_users SET last_login = NOW() WHERE id = ${admin.id}`

    const token = await createToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    })

    await setAdminCookie(token)

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
