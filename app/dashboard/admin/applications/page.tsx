"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Mail, Phone, FileText } from "lucide-react"
import Link from "next/link"

type Application = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  subjects: string
  experience: string
  qualifications: string
  motivation: string
  profile_picture?: string | null
  application_status: "pending" | "approved" | "rejected"
  created_at: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Fetch applications from backend
  const fetchApplications = async () => {
    setFetching(true)
    try {
      const res = await fetch("/api/admin/tutor_applications")

      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()

      if (data.success) {
        setApplications(data.applications)
      } else {
        alert("Failed to load applications: " + data.error)
      }
    } catch (error) {
      console.error(error)
      alert("Error fetching applications: " + (error as Error).message)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const updateApplicationStatus = async (id: number, action: "approve" | "reject") => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/tutor-applications/${id}/${action}`, {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      if (data.success) {
        alert(`Application ${id} ${action === "approve" ? "approved" : "rejected"}!`)
        fetchApplications()
      } else {
        alert(`Failed to ${action}: ${data.error}`)
      }
    } catch (error) {
      console.error(error)
      alert("Error: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (id: number) => updateApplicationStatus(id, "approve")
  const handleReject = (id: number) => updateApplicationStatus(id, "reject")

  if (fetching) return <p className="text-center py-20 text-xl">Loading applications...</p>

  if (applications.length === 0)
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl text-muted-foreground">No tutor applications found.</p>
        </main>
        <Footer />
        <WhatsappButton />
      </div>
    )

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-5xl font-bold text-secondary md:text-6xl">Tutor Applications</h1>
            <Link href="/dashboard/admin">
              <Button variant="outline" className="text-lg bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="border-2 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {app.profile_picture && (
                        <img
                          src={app.profile_picture}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      )}
                      <div>
                        <CardTitle className="text-2xl">{app.first_name} {app.last_name}</CardTitle>
                        <div className="mt-2">
                          <Badge
                            variant={
                              app.application_status === "pending"
                                ? "outline"
                                : app.application_status === "approved"
                                ? "default"
                                : "destructive"
                            }
                            className="text-sm flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            {app.application_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="text-lg">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span className="text-lg">{app.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-lg">
                        <span className="font-semibold">Subjects:</span> {app.subjects}
                      </span>
                    </div>
                    <div className="text-lg">
                      <span className="font-semibold">Experience:</span> {app.experience}
                    </div>
                    <div className="text-lg">
                      <span className="font-semibold">Qualifications:</span> {app.qualifications}
                    </div>
                  </div>

                  {app.application_status === "pending" && (
                    <div className="flex gap-4">
                      <Button
                        className="flex-1 text-lg"
                        onClick={() => handleApprove(app.id)}
                        disabled={loading}
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 text-lg"
                        onClick={() => handleReject(app.id)}
                        disabled={loading}
                      >
                        <XCircle className="mr-2 h-5 w-5" />
                        Reject
                      </Button>
                    </div>
                  )}
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
