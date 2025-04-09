"use client"

import { Check, Clock, Filter, Plus, Search, X } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AutorizacionesPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">Autorizaciones</h1>
          <p className="text-muted-foreground">Gestiona las solicitudes de acceso y permisos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrar</span>
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90">
            <Plus className="h-3.5 w-3.5" />
            <span>Nueva Autorización</span>
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar solicitudes..."
          className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                user: "María López",
                type: "Acceso a Proyecto",
                project: "Sistema CRM",
                requestDate: "15/03/2025",
                status: "Pendiente",
              },
              {
                user: "Carlos Ruiz",
                type: "Cambio de Rol",
                project: "N/A",
                requestDate: "14/03/2025",
                status: "Pendiente",
              },
              {
                user: "Ana García",
                type: "Acceso a Repositorio",
                project: "API Gateway",
                requestDate: "13/03/2025",
                status: "Pendiente",
              },
            ].map((request, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={request.user} />
                    <AvatarFallback>
                      {request.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.user}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Solicitado: {request.requestDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{request.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.project !== "N/A" ? `Proyecto: ${request.project}` : "Sin proyecto asociado"}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    {request.status}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                user: "Juan Díaz",
                type: "Acceso a Proyecto",
                project: "Portal de Clientes",
                requestDate: "10/03/2025",
                status: "Aprobado",
                resolvedDate: "11/03/2025",
              },
              {
                user: "Laura Martín",
                type: "Cambio de Rol",
                project: "N/A",
                requestDate: "08/03/2025",
                status: "Rechazado",
                resolvedDate: "09/03/2025",
              },
            ].map((request, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={request.user} />
                    <AvatarFallback>
                      {request.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.user}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Resuelto: {request.resolvedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{request.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.project !== "N/A" ? `Proyecto: ${request.project}` : "Sin proyecto asociado"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={request.status === "Aprobado" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                  >
                    {request.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

