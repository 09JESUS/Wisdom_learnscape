import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [users]: any = await db.query(`
      SELECT 
        id,
        email,
        phone,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `)

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error("Fetch users error:", error)
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [users]: any = await db.query(`
      SELECT 
        id,
        email,
        phone,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `)

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error("Fetch users error:", error)
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

