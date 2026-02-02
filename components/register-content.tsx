"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User, Mail, Phone, Lock, School, Users, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "standard"
  const subject = searchParams.get("subject") || "mathematics"

  const [learner, setLearner] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    gender: "Male",
    phone_number: "",
    school: "",
    email: "",
    password: "",
  })

  const [parent, setParent] = useState({
    title: "",
    initials: "",
    surname: "",
    contact_number: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const passwordStrength = (pwd: string) => {
    if (pwd.length < 6) return "Weak"
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/)) return "Strong"
    return "Medium"
  }

  const handleContinue = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ learner, parent, plan, subject }),
    });

    const data = await response.json();
    console.log("Backend response:", data);

    // ✅ Use status check instead of response.ok
    if (response.status >= 400) {
      throw new Error(data.message || "Registration failed");
    }

    alert("Registration successful! Proceeding to payment...");
    router.push(`/payment?plan=${plan}&subject=${subject}`);
  } catch (err: any) {
    alert(err.message);
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen bg-muted/40 py-20">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-2 text-primary">
              <ShieldCheck size={18} /> Registration
            </span>
            <span className="h-px w-12 bg-muted-foreground/40" />
            <span className="text-muted-foreground">Payment</span>
            <span className="h-px w-12 bg-muted-foreground/40" />
            <span className="text-muted-foreground">Confirmation</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleContinue}>
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Learner Card */}
            <Card className="p-10 rounded-2xl shadow-xl border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User /> Learner Details
              </h2>
              <div className="grid gap-5">
                <Label>First Name</Label>
                <Input
                  value={learner.first_name}
                  onChange={(e) => setLearner({ ...learner, first_name: e.target.value })}
                  required
                  className="h-11"
                />

                <Label>Last Name</Label>
                <Input
                  value={learner.last_name}
                  onChange={(e) => setLearner({ ...learner, last_name: e.target.value })}
                  required
                  className="h-11"
                />

                <Label>Nickname (optional)</Label>
                <Input
                  value={learner.nickname}
                  onChange={(e) => setLearner({ ...learner, nickname: e.target.value })}
                  className="h-11"
                />

                <Label>Gender</Label>
                <div className="flex gap-6 mt-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={learner.gender === g}
                        onChange={() => setLearner({ ...learner, gender: g })}
                        className="accent-primary"
                        required
                      />
                      {g}
                    </label>
                  ))}
                </div>

                <Label>Phone Number</Label>
                <Input
                  value={learner.phone_number}
                  onChange={(e) => setLearner({ ...learner, phone_number: e.target.value })}
                  required
                  className="h-11"
                />

                <Label>School Attended</Label>
                <Input
                  value={learner.school}
                  onChange={(e) => setLearner({ ...learner, school: e.target.value })}
                  required
                  className="h-11"
                />

                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={learner.email}
                  onChange={(e) => setLearner({ ...learner, email: e.target.value })}
                  required
                  className="h-11"
                />

                <Label>Password</Label>
                <Input
                  type="password"
                  value={learner.password}
                  onChange={(e) => setLearner({ ...learner, password: e.target.value })}
                  required
                  className="h-11"
                />
                {learner.password && (
                  <p className="text-sm mt-1 text-muted-foreground">
                    Strength: <span className="font-semibold">{passwordStrength(learner.password)}</span>
                  </p>
                )}
              </div>
            </Card>

            {/* Parent Card */}
            <Card className="p-10 rounded-2xl shadow-xl border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users /> Parent / Guardian
              </h2>
              <div className="grid gap-5">
                <Label>Title (Mr/Mrs/Ms)</Label>
                <Input
                  value={parent.title}
                  onChange={(e) => setParent({ ...parent, title: e.target.value })}
                  required
                  className="h-11"
                />

                <Label>Initials</Label>
                <Input
                  value={parent.initials}
                  onChange={(e) => setParent({ ...parent, initials: e.target.value })}
                  required
                  className="h-11"
                />

                <Label>Surname</Label>
                <Input
                  value={parent.surname}
                  onChange={(e) => setParent({ ...parent, surname: e.target.value })}
                  required
                  className="h-11"
                />

                <Label>Contact Number</Label>
                <Input
                  value={parent.contact_number}
                  onChange={(e) => setParent({ ...parent, contact_number: e.target.value })}
                  required
                  className="h-11"
                />

                <Label>Password</Label>
                <Input
                  type="password"
                  value={parent.password}
                  onChange={(e) => setParent({ ...parent, password: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-10 h-12 text-lg font-semibold"
                disabled={loading}
              >
                {loading ? "Registering..." : "Continue to Payment"}
              </Button>
            </Card>
          </div>
        </form>
      </div>
    </main>
  )
}
