"use client"

import { Building, ChevronDown, Edit, Filter, MoreHorizontal, Plus, Search, Trash, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function DepartamentosPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">Departamentos</h1>
          <p className="text-muted-foreground">Gestiona la estructura organizacional de la empresa</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrar</span>
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90">
            <Plus className="h-3.5 w-3.5" />
            <span>Nuevo Departamento</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar departamentos..."
            className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>Estado</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Todos</DropdownMenuItem>
            <DropdownMenuItem>Activos</DropdownMenuItem>
            <DropdownMenuItem>Inactivos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Departamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Tecnología",
                manager: "Juan Díaz",
                employees: 25,
                projects: 8,
                status: "Activo",
              },
              {
                name: "Diseño",
                manager: "María Rodríguez",
                employees: 12,
                projects: 5,
                status: "Activo",
              },
              {
                name: "Marketing",
                manager: "Carlos López",
                employees: 15,
                projects: 4,
                status: "Activo",
              },
              {
                name: "Recursos Humanos",
                manager: "Ana Martínez",
                employees: 8,
                projects: 2,
                status: "Activo",
              },
            ].map((department, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{department.name}</p>
                    <p className="text-sm text-muted-foreground">Manager: {department.manager}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{department.employees} empleados</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{department.projects} proyectos</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {department.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Acciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

