// app/api/admin/tutor-applications/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Fetch all tutor applications
    const [rows] = await db.query(
      "SELECT id, first_name, last_name, email, phone, subjects, experience, qualifications, motivation, profile_picture, application_status, submitted_at AS created_at FROM tutor_applications ORDER BY submitted_at DESC"
    );

    return NextResponse.json({ success: true, applications: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
// app/api/admin/tutor-applications/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Fetch all tutor applications
    const [rows] = await db.query(
      "SELECT id, first_name, last_name, email, phone, subjects, experience, qualifications, motivation, profile_picture, application_status, submitted_at AS created_at FROM tutor_applications ORDER BY submitted_at DESC"
    );

    return NextResponse.json({ success: true, applications: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

