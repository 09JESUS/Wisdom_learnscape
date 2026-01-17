"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

type Student = {
  id: number
  name: string
  subject: string
  email: string
  nickname: string
  gender: string
  phone_number: string
  school: string
  created_at: string
}

export default function TutorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await axios.get("/api/tutor/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setStudents(res.data)
      } catch (err) {
        console.error("Failed to load students", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/dashboard/tutor"
            className="inline-flex items-center gap-2 text-lg text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Tutor Dashboard
          </Link>

          <h1 className="mb-12 text-5xl font-bold text-secondary md:text-6xl">
            My Mathematics Students
          </h1>

          {loading && <p className="text-xl">Loading students...</p>}

          {!loading && students.length === 0 && (
            <p className="text-xl text-muted-foreground">
              No students registered for your subject yet.
            </p>
          )}

          <div className="grid gap-6">
            {students.map((student) => (
              <Card key={student.id} className="border-2">
                <CardHeader>
                  <CardTitle className="text-3xl">{student.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-lg text-muted-foreground">Subject</p>
                      <p className="text-xl font-semibold">{student.subject}</p>
                    </div>
                    <div>
                      <p className="text-lg text-muted-foreground">Email</p>
                      <p className="text-xl">{student.email}</p>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Link href={`/dashboard/tutor/students/${student.id}`}>
                        <Button>View Profile</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappButton />
    </div>
  )
}
