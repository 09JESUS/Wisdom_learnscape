import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      bio,
      hourlyRate,
      subjects,
      experienceYears,
      qualifications,
      availableHours,
    } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const password_hash = await bcrypt.hash(password, 10)

    // Insert into USERS table (login)
    const [result]: any = await pool.execute(
      `
      INSERT INTO users (email, password_hash, role, created_at)
      VALUES (?, ?, 'tutor', NOW())
      `,
      [email, password_hash]
    )

    const userId = result.insertId

    // OPTIONAL: Tutor profile table (recommended)
    await pool.execute(
      `
      INSERT INTO tutors (
        user_id,
        first_name,
        last_name,
        bio,
        hourly_rate,
        subjects,
        experience_years,
        qualifications,
        available_hours
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        firstName,
        lastName,
        bio,
        hourlyRate,
        subjects,
        experienceYears,
        qualifications,
        availableHours,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("ADD TUTOR ERROR:", err)
    return NextResponse.json({ error: "Failed to add tutor" }, { status: 500 })
  }
}
