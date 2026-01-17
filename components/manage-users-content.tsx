"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Phone, UserX, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"

type User = {
  id: number
  email: string
  phone: string
  role: string
  created_at: string
}

export function ManageUsersContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // -------------------------
  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users")
        setUsers(res.data)
      } catch (err) {
        setError("Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery)
  )

  if (loading) {
    return (
      <Card className="border-2">
        <CardContent className="py-12 text-center text-xl">
          Loading users...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-2">
        <CardContent className="py-12 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Search */}
      <Card className="mb-8 border-2">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by email or phone..."
              className="pl-10 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users */}
      <div className="grid gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="border-2 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {user.email}
                  </CardTitle>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="default">{user.role}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    <UserX className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  {user.email}
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  {user.phone || "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="border-2">
          <CardContent className="py-12 text-center">
            No users found.
          </CardContent>
        </Card>
      )}
    </>
  )
}
