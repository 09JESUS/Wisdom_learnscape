"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, FileText, Settings, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"

type Tutor = {
  id: number
  first_name: string
  last_name: string
  subjects: string[]
}

export default function TutorDashboard() {
  const [tutor, setTutor] = useState<Tutor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await axios.get("/api/tutor/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setTutor(res.data)
      } catch (err) {
        console.error("Failed to fetch tutor info", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTutor()
  }, [])

  const dashboardCards = [
    {
      title: "My Students",
      description: "Manage and view your assigned students",
      icon: <Users className="h-8 w-8 text-primary" />,
      link: "/dashboard/tutor/students",
    },
    {
      title: "Schedule",
      description: "View and manage your teaching sessions",
      icon: <Calendar className="h-8 w-8 text-primary" />,
      link: "/dashboard/tutor/schedule",
    },
    {
      title: "My Subjects",
      description: "See the subjects you are teaching",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      link: "/dashboard/tutor/subjects",
    },
    {
      title: "Materials",
      description: "Upload and manage teaching materials",
      icon: <FileText className="h-8 w-8 text-primary" />,
      link: "/dashboard/tutor/materials",
    },
    {
      title: "Messages",
      description: "Chat with students and parents",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      link: "/dashboard/tutor/messages",
    },
    {
      title: "Settings",
      description: "Update your profile and availability",
      icon: <Settings className="h-8 w-8 text-primary" />,
      link: "/dashboard/tutor/settings",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navigation />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-5xl font-bold text-secondary md:text-6xl">
            Tutor Dashboard
          </h1>

          {!loading && tutor && (
            <p className="mb-12 text-xl text-muted-foreground">
              Welcome back, <span className="font-semibold">{tutor.first_name} {tutor.last_name}</span>! You are teaching{" "}
              <span className="font-medium">{tutor.subjects.join(", ")}</span>.
            </p>
          )}

          {loading && <p className="text-xl text-muted-foreground">Loading your dashboard...</p>}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dashboardCards.map((card, idx) => (
              <Card
                key={idx}
                className="border-2 rounded-xl transition-shadow hover:shadow-xl hover:border-primary"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    {card.icon}
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground mb-4">{card.description}</p>
                  <Link href={card.link}>
                    <Button className="w-full text-lg hover:bg-primary hover:text-white transition-colors">
                      Go
                    </Button>
                  </Link>
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
