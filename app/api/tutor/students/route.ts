<<<<<<< HEAD
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    // 🔐 Get tutor from JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "tutor") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // 1️⃣ Get tutor subjects
    const [tutorRows]: any = await db.query(
      "SELECT subjects FROM tutors WHERE user_id = ?",
      [decoded.id]
    );

    if (!tutorRows.length) return NextResponse.json([], { status: 200 });

    const subjects = tutorRows[0].subjects.split(",").map((s: string) => s.trim());
    if (subjects.length === 0) return NextResponse.json([], { status: 200 });

    // 2️⃣ Build placeholders for MySQL IN clause
    const placeholders = subjects.map(() => "?").join(",");

    // 3️⃣ Fetch learners directly from learners table (without grade)
    const [students]: any = await db.query(
      `
      SELECT
        l.id,
        CONCAT(l.first_name, ' ', l.last_name) AS name,
        l.subject,
        u.email,
        l.nickname,
        l.gender,
        l.phone_number,
        l.school,
        l.created_at
      FROM learners l
      JOIN users u ON u.id = l.user_id
      WHERE l.subject IN (${placeholders})
      `,
      subjects
    );

    return NextResponse.json(students);
  } catch (err: any) {
    console.error("TUTOR STUDENTS ERROR:", err);
    return NextResponse.json({ message: "Failed to fetch students", error: err.message }, { status: 500 });
  }
}
=======
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    // 🔐 Get tutor from JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "tutor") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // 1️⃣ Get tutor subjects
    const [tutorRows]: any = await db.query(
      "SELECT subjects FROM tutors WHERE user_id = ?",
      [decoded.id]
    );

    if (!tutorRows.length) return NextResponse.json([], { status: 200 });

    const subjects = tutorRows[0].subjects.split(",").map((s: string) => s.trim());
    if (subjects.length === 0) return NextResponse.json([], { status: 200 });

    // 2️⃣ Build placeholders for MySQL IN clause
    const placeholders = subjects.map(() => "?").join(",");

    // 3️⃣ Fetch learners directly from learners table (without grade)
    const [students]: any = await db.query(
      `
      SELECT
        l.id,
        CONCAT(l.first_name, ' ', l.last_name) AS name,
        l.subject,
        u.email,
        l.nickname,
        l.gender,
        l.phone_number,
        l.school,
        l.created_at
      FROM learners l
      JOIN users u ON u.id = l.user_id
      WHERE l.subject IN (${placeholders})
      `,
      subjects
    );

    return NextResponse.json(students);
  } catch (err: any) {
    console.error("TUTOR STUDENTS ERROR:", err);
    return NextResponse.json({ message: "Failed to fetch students", error: err.message }, { status: 500 });
  }
}
>>>>>>> 17c59ea2ff3ca3bda2b5d259767ccc75d5310d99
