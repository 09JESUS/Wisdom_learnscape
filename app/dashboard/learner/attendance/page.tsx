"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance & Schedule</h1>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <p>🟢 Present | 🔴 Absent | 🟡 Late</p>
          <div className="h-40 mt-4 rounded bg-slate-100" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>Date · Time · Subject · Tutor</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-slate-100 rounded" />
          <p className="mt-2 text-sm">Improving / Consistent / Dropping</p>
        </CardContent>
      </Card>
    </div>
  )
}
