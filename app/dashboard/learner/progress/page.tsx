"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Progress & Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Learning Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>What was covered</p>
          <p>Strengths observed</p>
          <p>Areas to focus next week</p>
          <p>Effort rating: ⭐⭐⭐⭐☆</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Goal Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Master algebra basics – In Progress</p>
          <p>Essay writing – Achieved</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Parent Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Download PDF</Button>
        </CardContent>
      </Card>
    </div>
  )
}
