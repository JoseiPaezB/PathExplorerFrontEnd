import { useState, useEffect, useRef } from "react"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  User,
  Users,
  FileCheck,
  Building,
  Settings,
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { User as AuthUser } from "@/types/auth";
import { useAuth } from "@/contexts/auth-context";

interface SidebarProps {
  className?: string
  userRole: string
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export function Sidebar({ className, userRole, collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const shouldReduceMotion = useReducedMotion()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth() as { user: AuthUser | null };


  const baseItems = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Mi Perfil", href: "/perfil", icon: User },
  ]

  const roleItems = {
    empleado: [
      { title: "Mi Proyecto", href: "/proyecto-actual", icon: Briefcase },
      { title: "Mis Cursos", href: "/cursos", icon: BookOpen },
      { title: "Mi Desempeño", href: "/analitica", icon: BarChart3 },
    ],
    manager: [
      { title: "Gestión de Proyectos", href: "/proyectos", icon: Briefcase },
      { title: "Equipo", href: "/equipo", icon: Users },
      { title: "Analítica", href: "/analitica", icon: BarChart3 },
    ],
    administrador: [
      { title: "Gestión de Usuarios", href: "/usuarios", icon: Users },
      { title: "Autorizaciones", href: "/autorizaciones", icon: FileCheck },
      { title: "Departamentos", href: "/departamentos", icon: Building },
    ],
  }

  const navItems = [
    ...baseItems,
    ...(roleItems[userRole as keyof typeof roleItems] || []),
    { title: "Configuración", href: "/configuracion", icon: Settings },
  ]

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  }

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -8 }
  }

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={collapsed ? "collapsed" : "expanded"}
        variants={shouldReduceMotion ? {} : sidebarVariants}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed left-0 top-0 flex h-screen flex-col border-r bg-white/95 backdrop-blur-xl backdrop-saturate-150 z-30",
          "shadow-[0_0_15px_rgba(0,0,0,0.05)]",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header with logo toggle */}
          <div className="flex items-center justify-between h-16 px-4 border-b bg-white/50">
            <AnimatePresence mode="wait">
              <motion.div
                key="logo-toggle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center cursor-pointer"
                onClick={toggleSidebar}  // Make logo toggle the sidebar collapse
              >
                {/* Show the collapsed logo or expanded logo based on sidebar state */}
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* User Profile Section */}
          <div className={cn(
            "flex items-center px-4 py-4 border-b bg-gray-50/50",
            collapsed && "justify-center"
          )}>
            <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm flex-shrink-0">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="ml-3 overflow-hidden"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">{`${user?.nombre} ${user?.apellido}`}</p>
                  <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 overflow-y-auto py-4",
            collapsed ? "px-2" : "px-3"
          )}>
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link href={item.href} className="block">
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full relative",
                            isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                            !collapsed && "px-3 justify-start",
                            collapsed && "px-0 h-10 w-10 justify-center mx-auto"
                          )}
                        >
                          <item.icon size={collapsed ? 22 : 20} className={cn(
                            isActive && "text-primary",
                            !isActive && "text-gray-500"
                          )} />
                          
                          {!collapsed && (
                            <motion.span
                              variants={itemVariants}
                              initial="collapsed"
                              animate="expanded"
                              className="ml-3 overflow-hidden whitespace-nowrap"
                            >
                              {item.title}
                            </motion.span>
                          )}
                          
                          {isActive && collapsed && (
                            <motion.div
                              className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full"
                              layoutId="activeIndicator"
                            />
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="ml-2 bg-gray-800 text-white border-none">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                )
              })}
            </div>
          </nav>

          {/* Footer with Logout */}
          <div className={cn(
            "border-t py-4",
            collapsed ? "px-2" : "px-3"
          )}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={logout}
                  className={cn(
                    "w-full",
                    !collapsed && "justify-start",
                    collapsed && "px-0 h-10 w-10 justify-center mx-auto"
                  )}
                >
                  <LogOut size={collapsed ? 22 : 20} />
                  {!collapsed && (
                    <motion.span
                      variants={itemVariants}
                      initial="collapsed"
                      animate="expanded"
                      className="ml-3 overflow-hidden whitespace-nowrap"
                    >
                      Cerrar Sesión
                    </motion.span>
                  )}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="ml-2 bg-gray-800 text-white border-none">
                  Cerrar Sesión
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
