// app/api/learner/dashboard/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const learnerId = url.searchParams.get("learnerId") // pass learnerId as query

    if (!learnerId) {
      return NextResponse.json({ message: "Learner ID required" }, { status: 400 })
    }

    // Fetch learner info
    const [learnerRows] = await db.query(
      "SELECT first_name, last_name FROM learners WHERE user_id = ?",
      [learnerId]
    )
    const learner = learnerRows[0] || { first_name: "", last_name: "" }

    // Attendance & Schedule
    const [attendance] = await db.query(
      "SELECT date, status FROM attendance WHERE learner_id = ? ORDER BY date DESC LIMIT 5",
      [learnerId]
    )
    const [schedule] = await db.query(
      "SELECT subject, day_of_week, start_time, end_time FROM schedule WHERE learner_id = ?",
      [learnerId]
    )

    // Homework & Tasks
    const [tasks] = await db.query(
      "SELECT title, status, due_date FROM homework_tasks WHERE learner_id = ? ORDER BY due_date ASC",
      [learnerId]
    )

    // Progress & Reports
    const [reports] = await db.query(
      "SELECT subject, assessment_type, score, max_score FROM progress_reports WHERE learner_id = ? ORDER BY report_date DESC",
      [learnerId]
    )

    // Unread messages count
    const [messages] = await db.query(
      "SELECT COUNT(*) AS unread_count FROM communications WHERE receiver_id = ? AND read_status = 0",
      [learnerId]
    )

    return NextResponse.json({
      learner,
      attendance,
      schedule,
      tasks,
      reports,
      unreadMessages: messages[0]?.unread_count || 0,
    })
  } catch (err: any) {
    console.error("Dashboard API Error:", err)
    return NextResponse.json({ message: "Failed to fetch dashboard data", error: err.message }, { status: 500 })
  }
}
