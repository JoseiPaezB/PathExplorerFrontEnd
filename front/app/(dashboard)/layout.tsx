"use client"
import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "../../lib/utils"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isAuthenticated } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [collapsed, setCollapsed] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            console.log("Usuario no autenticado, redirigiendo a login desde useEffect")
            router.push("/login")
        } else {
            setIsCheckingAuth(false)
        }
    }, [isAuthenticated, isLoading, router])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    if (isCheckingAuth || isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center">
                    <img
                        src= "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
                  alt="Logo"
                        className="h-16 w-17 mb-4"
                    />
                    <div className="h-1 w-48 bg-gray-100 overflow-hidden rounded-full">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "linear",
                            }}
                            className="h-full w-1/3 bg-primary rounded-full"
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return null
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center"
                        >
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-16 w-16 mb-4"
                            />
                            <div className="h-1 w-48 bg-gray-100 overflow-hidden rounded-full">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        ease: "linear",
                                    }}
                                    className="h-full w-1/3 bg-primary rounded-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Sidebar 
                userRole={user?.role || "employee"} 
                className="fixed left-0 top-0 z-30" 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={cn(
                    "flex-1 transition-all duration-300",
                    collapsed ? "ml-[80px]" : "ml-[280px]"
                )}
            >
                <Header user={user} collapsed={collapsed} />
                <main className="h-[calc(100vh-4rem)] overflow-y-auto px-8 py-8 mt-14">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={user?.id || "default"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-7xl mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </motion.div>

            <Toaster />
        </div>
    )
}