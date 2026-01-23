"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import * as jwt_decode from "jwt-decode"


interface Session {
  subject: string
  time: string
  tutor: string
}

interface Task {
  title: string
  status: "Completed" | "Pending" | "Overdue"
}

interface Report {
  subject: string
  score: number
  max_score: number
}

interface DashboardData {
  learner: {
    first_name: string
    last_name: string
  }
  attendance: { date: string; status: string }[]
  schedule: Session[]
  tasks: Task[]
  reports: Report[]
  unreadMessages: number
  announcements: string[]
}

interface JwtPayload {
  userId: number
  role: string
  email: string
  exp: number
}

export default function LearnerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("User not logged in")

        // Decode JWT to get learner ID
        const decoded = jwt_decode<JwtPayload>(token)
const learnerId = decoded.userId

        const res = await axios.get(`/api/learner/dashboard?learnerId=${learnerId}`)
        setData(res.data)
      } catch (err) {
        console.error("Failed to load dashboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) return <p>Loading dashboard...</p>
  if (!data) return <p>Failed to load dashboard.</p>

  const learner = data.learner || { first_name: "", last_name: "" }

  // Attendance %
  const totalSessions = data.attendance?.length || 0
  const attended = data.attendance?.filter((a) => a.status === "Present").length || 0
  const attendancePercent = totalSessions ? Math.round((attended / totalSessions) * 100) : 0

  // Engagement score
  const engagementScore = totalSessions ? Math.min(5, 3 + (attended / totalSessions) * 2) : 3

  // Homework summary
  const homeworkSummary = {
    completed: data.tasks?.filter((t) => t.status === "Completed").length || 0,
    pending: data.tasks?.filter((t) => t.status === "Pending").length || 0,
    overdue: data.tasks?.filter((t) => t.status === "Overdue").length || 0,
  }

  return (
    <div>
      {/* Welcome message */}
      <h1 className="mb-8 text-3xl font-bold text-slate-800">
        Welcome, {learner.first_name} {learner.last_name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Session */}
        <Card className="lg:col-span-2">
          <CardHeader className="bg-teal-600 text-white rounded-t-lg">
            <CardTitle>Today's Session</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            {data.schedule?.length > 0 ? (
              <div>
                <p className="text-xl font-semibold">{data.schedule[0].subject}</p>
                <p className="text-muted-foreground">{data.schedule[0].time}</p>
                <p className="text-sm mt-2">Tutor: {data.schedule[0].tutor}</p>
              </div>
            ) : (
              <p>No sessions today.</p>
            )}
            <div className="h-14 w-14 rounded-full bg-slate-200" />
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teal-600">{attendancePercent}%</p>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="mt-3 text-sm">This Week: {attended}/{totalSessions} sessions attended</p>
            <Button className="mt-4 w-full">View Details</Button>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{engagementScore.toFixed(1)} / 5</p>
            <p className="text-sm text-muted-foreground">Actively participating</p>
            <div className="mt-3 h-2 rounded bg-slate-200">
              <div className="h-2 w-[84%] rounded bg-teal-600" />
            </div>
          </CardContent>
        </Card>

        {/* Homework Status */}
        <Card>
          <CardHeader>
            <CardTitle>Homework Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-green-600">✔ Completed: {homeworkSummary.completed}</p>
            <p className="text-yellow-600">⏳ Pending: {homeworkSummary.pending}</p>
            <p className="text-red-600">✖ Overdue: {homeworkSummary.overdue}</p>
          </CardContent>
        </Card>

        {/* General Progress */}
        <Card>
          <CardHeader>
            <CardTitle>General Progress Indicator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">Improving</p>
            <div className="mt-3 h-2 rounded bg-slate-200">
              <div className="h-2 w-[70%] rounded bg-teal-600" />
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            {data.announcements?.length > 0 ? (
              data.announcements.map((a, i) => <p key={i}>• {a}</p>)
            ) : (
              <p>No announcements</p>
            )}
            <Button variant="link" className="px-0">more</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
