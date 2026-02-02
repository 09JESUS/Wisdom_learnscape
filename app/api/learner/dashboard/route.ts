import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    // 🔐 Authenticate user
    const user = await getUserFromToken(req)

    if (!user || user.role !== "learner") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const learnerId = user.id

    // 👤 Learner profile
    const [learnerRows]: any = await db.query(
      `SELECT first_name, last_name, grade 
       FROM learners 
       WHERE user_id = ?`,
      [learnerId]
    )

    if (!learnerRows.length) {
      return NextResponse.json(
        { message: "Learner not found" },
        { status: 404 }
      )
    }

    const learner = learnerRows[0]

    // 📦 Subscription
    const [subscriptionRows]: any = await db.query(
      `SELECT plan 
       FROM subscriptions 
       WHERE learner_id = ? AND status = 'active'`,
      [learnerId]
    )

    // 📊 Attendance (month)
    const [[attendanceMonth]]: any = await db.query(
      `SELECT ROUND(AVG(status = 'present') * 100) AS percentage
       FROM attendance
       WHERE learner_id = ?
       AND MONTH(date) = MONTH(CURRENT_DATE())`,
      [learnerId]
    )

    // 📅 Attendance (week)
    const [[attendanceWeek]]: any = await db.query(
      `SELECT COUNT(*) AS attended
       FROM attendance
       WHERE learner_id = ?
       AND status = 'present'
       AND WEEK(date) = WEEK(CURRENT_DATE())`,
      [learnerId]
    )

    // 📚 Homework
    const [[homework]]: any = await db.query(
      `SELECT
        SUM(status = 'completed') AS completed,
        SUM(status = 'pending') AS pending,
        SUM(status = 'overdue') AS overdue
       FROM homework_tasks
       WHERE learner_id = ?`,
      [learnerId]
    )

    // ⭐ Engagement
    const [[engagement]]: any = await db.query(
      `SELECT engagement_score 
       FROM engagement 
       WHERE learner_id = ?`,
      [learnerId]
    )

    // 🗓️ Today session
    const [[todaySession]]: any = await db.query(
      `SELECT subject, start_time, tutor_name
       FROM schedule
       WHERE learner_id = ?
       AND day_of_week = DAYNAME(CURRENT_DATE())
       LIMIT 1`,
      [learnerId]
    )

    // 💬 Unread messages
    const [[messages]]: any = await db.query(
      `SELECT COUNT(*) AS unread
       FROM communications
       WHERE receiver_id = ?
       AND read_status = 0`,
      [learnerId]
    )

    // ✅ RESPONSE MATCHES FRONTEND TYPES
    return NextResponse.json({
      learner: {
        first_name: learner.first_name,
        last_name: learner.last_name,
        grade: learner.grade,
      },
      subscriptionPlan: subscriptionRows?.[0]?.plan ?? "Free",
      attendance: {
        month: attendanceMonth?.percentage ?? 0,
        week: attendanceWeek?.attended ?? 0,
      },
      homework: {
        completed: homework?.completed ?? 0,
        pending: homework?.pending ?? 0,
        overdue: homework?.overdue ?? 0,
      },
      engagementScore: engagement?.engagement_score ?? 0,
      todaySession: todaySession ?? null,
      unreadMessages: messages?.unread ?? 0,
    })
  } catch (error) {
    console.error("Dashboard API Error:", error)
    return NextResponse.json(
      { message: "Failed to load dashboard" },
      { status: 500 }
    )
  }
}
