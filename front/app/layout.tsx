import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthVerification } from '@/components/auth-verification';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gestión de Talentos y Proyectos",
  description: "HR Analytics & Career Path",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider><AuthVerification>{children}</AuthVerification></AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'