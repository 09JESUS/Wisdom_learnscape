"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AddAdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    profile_pic: null as File | null,
  })
  const [generatedCode, setGeneratedCode] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [profilePicUrl, setProfilePicUrl] = useState("") // URL to show uploaded image

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("surname", formData.surname)
      data.append("email", formData.email)
      data.append("phone", formData.phone)
      data.append("password", formData.password)
      data.append("role", "admin")
      if (formData.profile_pic) data.append("profile_pic", formData.profile_pic)

      const res = await fetch("/api/admin/add", {
        method: "POST",
        body: data,
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.message)
        return
      }

      setGeneratedCode(result.admin.admin_code)
      setProfilePicUrl(result.admin.profile_pic_url || "") // Save the image URL returned by backend
      setSubmitted(true)
    } catch (err) {
      console.error("Failed to add admin:", err)
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-2xl">
        <Link href="/dashboard/admin/settings">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>
        </Link>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-secondary">Add New Admin</CardTitle>
            <p className="text-muted-foreground mt-2">
              Create a new administrator account with a unique access code
            </p>
          </CardHeader>

          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter first name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    id="surname"
                    placeholder="Enter surname"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter a secure password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="profile_pic">Profile Image</Label>
                  <Input
                    id="profile_pic"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, profile_pic: e.target.files ? e.target.files[0] : null })
                    }
                    className="mt-2"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg">
                  Generate Admin Code
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription>Admin account created successfully!</AlertDescription>
                </Alert>

                <div className="bg-gray-50 p-6 rounded-lg border-2 border-primary space-y-2">
                  {profilePicUrl && (
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                      <img
                        src={profilePicUrl}
                        alt={`${formData.name} ${formData.surname}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p>
                    <span className="font-semibold">Name:</span> {formData.name} {formData.surname}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {formData.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {formData.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Role:</span> Admin
                  </p>
                  <p>
                    <span className="font-semibold">Admin Code:</span> {generatedCode}
                  </p>
                </div>

                <div className="flex gap-4 mt-4">
                  <Button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: "", surname: "", email: "", phone: "", password: "", profile_pic: null })
                      setGeneratedCode("")
                      setProfilePicUrl("")
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Add Another Admin
                  </Button>
                  <Link href="/dashboard/admin/settings" className="flex-1">
                    <Button className="w-full">Back to Settings</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
