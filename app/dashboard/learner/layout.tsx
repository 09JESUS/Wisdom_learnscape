<<<<<<< HEAD
"use client"

import LearnerSidebar from "@/components/ui/learner-sidebar"
export default function LearnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <LearnerSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
=======
"use client"

import LearnerSidebar from "@/components/ui/learner-sidebar"
export default function LearnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <LearnerSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
>>>>>>> 17c59ea2ff3ca3bda2b5d259767ccc75d5310d99
