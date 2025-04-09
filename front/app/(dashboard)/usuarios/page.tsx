"use client"
import { ChevronDown, Filter, Lock, Mail, Search, Trash, UserPlus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function UsuariosPage() {
  const { user, isAuthenticated } = useAuth();
      const router = useRouter();
  
      
          
          useEffect(() => {
             // Check if user has manager role
             if (isAuthenticated && user && user.role !== 'administrador') {
               console.log("Unauthorized access to proyectos page");
               router.push('/unauthorized');
            }
           }, [user, isAuthenticated, router]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los usuarios del sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrar</span>
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90">
            <UserPlus className="h-3.5 w-3.5" />
            <span>Nuevo Usuario</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>Rol</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por rol</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Todos</DropdownMenuItem>
            <DropdownMenuItem>Administrador</DropdownMenuItem>
            <DropdownMenuItem>Manager</DropdownMenuItem>
            <DropdownMenuItem>Empleado</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Juan Díaz",
                email: "juan.diaz@accenture.com",
                role: "manager",
                department: "Tecnología",
                status: "Activo",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
              },
              {
                name: "Ana García",
                email: "ana.garcia@accenture.com",
                role: "empleado",
                department: "Desarrollo",
                status: "Activo",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
              },
              {
                name: "Carlos Rodriguez",
                email: "carlos.rodriguez@accenture.com",
                role: "administrador",
                department: "IT",
                status: "Activo",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
              },
              {
                name: "María López",
                email: "maria.lopez@accenture.com",
                role: "empleado",
                department: "Diseño",
                status: "Inactivo",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
              },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={user.status === "Activo" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                    >
                      {user.status}
                    </Badge>
                    <p className="mt-1 text-sm text-muted-foreground">{user.department}</p>
                  </div>
                  <Badge>{user.role}</Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

