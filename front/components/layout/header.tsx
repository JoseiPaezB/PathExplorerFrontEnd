"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Bell, Calendar, Menu, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User as AuthUser } from "@/types/auth";
import { useAuth } from "@/contexts/auth-context";
import { NotificationResponse } from "@/types/notificaciones";

interface HeaderProps {
  user: AuthUser | null;
  collapsed: boolean;
}

export function Header({ user, collapsed }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userNotifications, setUserNotifications] =
    useState<NotificationResponse | null>(null);
  const { notifications, logout } = useAuth();
  const unreadCount =
    userNotifications?.notifications?.filter(
      (notification) => !notification.leida
    ).length || 0;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notifications();
        setUserNotifications(response);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [notifications]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const roleLabels = {
    empleado: "Empleado",
    manager: "Manager",
    administrador: "Administrador",
  };

  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(currentTime);

  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const router = useRouter();

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-40 flex h-16 items-center border-b px-8 transition-all duration-300 justify-between",
        collapsed ? "left-[80px]" : "left-[280px]",
        scrolled
          ? "glass border-transparent shadow-subtle"
          : "bg-white border-transparent"
      )}
    >
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 ? (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-white">
                  {unreadCount}
                </Badge>
              ) : (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-white opacity-0"></Badge>
              )}
              <span className="sr-only">Notificaciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center">
              <span>Notificaciones</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {unreadCount > 0 ? (
              userNotifications?.notifications
                .filter((notification) => !notification.leida)
                .map((notification, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex flex-col items-start p-3 focus:bg-muted"
                  >
                    <div className="flex w-full justify-between">
                      <span className="font-medium">{notification.titulo}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.mensaje}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.fecha_creacion}
                    </p>
                  </DropdownMenuItem>
                ))
            ) : (
              <DropdownMenuItem disabled>
                <p className="py-2 text-center w-full">
                  No tienes notificaciones sin leer
                </p>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <Link href="/notificaciones">
              <DropdownMenuItem className="justify-center text-center font-medium text-primary">
                Ver todas las notificaciones
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{capitalizedDate}</span>
        </div>

        <div className="hidden md:flex md:flex-col items-end">
          <h1 className="text-lg font-semibold">Accenture HR</h1>
          <p className="text-sm text-muted-foreground">
            {roleLabels[user.role]} - {user.nombre}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full p-0"
            >
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nombre}`}
                  alt={user.nombre}
                />
                <AvatarFallback>{user.nombre}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.nombre}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/perfil")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/configuracion")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>
    </header>
  );
}
