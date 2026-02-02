import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const token = authHeader.split(" ")[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== "tutor") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    const [rows]: any = await db.query("SELECT first_name, last_name, subjects FROM tutors WHERE user_id = ?", [
      decoded.id,
    ])

    if (!rows.length) return NextResponse.json({}, { status: 404 })

    const tutor = {
      id: decoded.id,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      subjects: rows[0].subjects.split(",").map((s: string) => s.trim()),
    }

    return NextResponse.json(tutor)
  } catch (err: any) {
    console.error("TUTOR INFO ERROR:", err)
    return NextResponse.json({ message: "Failed to fetch tutor info", error: err.message }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const token = authHeader.split(" ")[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== "tutor") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    const [rows]: any = await db.query("SELECT first_name, last_name, subjects FROM tutors WHERE user_id = ?", [
      decoded.id,
    ])

    if (!rows.length) return NextResponse.json({}, { status: 404 })

    const tutor = {
      id: decoded.id,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      subjects: rows[0].subjects.split(",").map((s: string) => s.trim()),
    }

    return NextResponse.json(tutor)
  } catch (err: any) {
    console.error("TUTOR INFO ERROR:", err)
    return NextResponse.json({ message: "Failed to fetch tutor info", error: err.message }, { status: 500 })
  }
}

