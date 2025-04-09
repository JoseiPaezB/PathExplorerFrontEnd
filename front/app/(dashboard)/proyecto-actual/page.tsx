"use client"

import { Clock, FileText, MessageSquare, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProyectoActualPage() {
  const { user, isAuthenticated } = useAuth();
        const router = useRouter();
    
        
            
            useEffect(() => {
               // Check if user has manager role
               if (isAuthenticated && user && user.role !== 'empleado') {
                 console.log("Unauthorized access to proyectos page");
                 router.push('/unauthorized');
              }
             }, [user, isAuthenticated, router]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mi Proyecto Actual</h1>
        <p className="text-muted-foreground">Detalles y progreso de tu proyecto asignado</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Sistema CRM</CardTitle>
              <CardDescription className="mt-2">
                Desarrollo de módulos de ventas y marketing para el nuevo sistema CRM
              </CardDescription>
            </div>
            <Badge className="bg-primary">En Progreso</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Fecha Inicio</CardDescription>
                <CardTitle className="text-base">15/02/2025</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Fecha Fin</CardDescription>
                <CardTitle className="text-base">15/05/2025</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Rol</CardDescription>
                <CardTitle className="text-base">Desarrollador Frontend</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Sprint Actual</CardDescription>
                <CardTitle className="text-base">Sprint 3/6</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Progreso General</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>65% completado</span>
                <span className="text-muted-foreground">45 de 72 tareas</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Equipo del Proyecto</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: "Juan Díaz",
                  role: "Project Manager",
                  email: "juan.diaz@empresa.com",
                },
                {
                  name: "María López",
                  role: "Backend Developer",
                  email: "maria.lopez@empresa.com",
                },
                {
                  name: "Carlos Ruiz",
                  role: "UX Designer",
                  email: "carlos.ruiz@empresa.com",
                },
                {
                  name: "Laura Martín",
                  role: "QA Engineer",
                  email: "laura.martin@empresa.com",
                },
              ].map((member, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Próximas Actividades</h3>
            <div className="space-y-4">
              {[
                {
                  title: "Daily Standup",
                  date: "Hoy, 10:00 AM",
                  type: "Reunión",
                },
                {
                  title: "Implementación de Dashboard",
                  date: "Vence en 2 días",
                  type: "Tarea",
                },
                {
                  title: "Sprint Review",
                  date: "Viernes, 15:00 PM",
                  type: "Reunión",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    {activity.type === "Reunión" ? (
                      <Users className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{activity.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat del equipo
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Clock className="h-4 w-4" />
            Registrar tiempo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

