"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Calendar,
  BarChart,
  ClipboardList,
  MessageSquare,
  Settings,
  Shield,
} from "lucide-react"
import clsx from "clsx"
import { useEffect, useState } from "react"
import axios from "axios"

export default function LearnerSidebar({ learnerId }: { learnerId: number }) {
  const pathname = usePathname()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/learner/dashboard?learnerId=${learnerId}`)
        setData(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [learnerId])

  const navItems = [
    { label: "Home Dashboard", icon: Home, href: "/dashboard/learner" },
    { label: "Attendance & Schedule", icon: Calendar, href: "/dashboard/learner/attendance", badge: data?.attendance?.length },
    { label: "Progress & Reports", icon: BarChart, href: "/dashboard/learner/progress" },
    { label: "Homework & Tasks", icon: ClipboardList, href: "/dashboard/learner/homework", badge: data?.tasks?.filter((t: any) => t.status === "Pending")?.length },
    { label: "Communication", icon: MessageSquare, href: "/dashboard/learner/communication", badge: data?.unreadMessages },
    { label: "Account & Settings", icon: Settings, href: "/dashboard/learner/settings" },
    { label: "Safety & Privacy", icon: Shield, href: "/dashboard/learner/safety" },
  ]

  return (
    <aside className="w-64 bg-slate-800 text-white">
      <div className="p-6 text-xl font-bold border-b border-slate-700">Learner Panel</div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition",
                active ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-slate-700"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
              {item.badge > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
