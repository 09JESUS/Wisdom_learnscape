import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Wisdom Learnscape | Dream. Do. Dominate.",
  description:
    "Unlock your full potential with a learning experience designed around YOU. High school tutoring for Grade 10-12.",
 icons: {
  icon: [
    {
      url: "/icon.jpeg",
      type: "image/jpeg",
    },
  ],
  apple: "/icon.jpeg",
},
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
