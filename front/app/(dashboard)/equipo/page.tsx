"use client"
import { Calendar, ChevronDown, Filter, Mail, Phone, Plus, Search, Briefcase } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function EquipoPage() {
  const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    
        
        useEffect(() => {
           // Check if user has manager role
           if (isAuthenticated && user && user.role !== 'manager') {
             console.log("Unauthorized access to proyectos page");
             router.push('/unauthorized');
          }
         }, [user, isAuthenticated, router]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Equipo</h1>
          <p className="text-muted-foreground">Administra y supervisa a los miembros de tu equipo</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrar</span>
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90">
            <Plus className="h-3.5 w-3.5" />
            <span>Añadir Miembro</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar miembros..."
            className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>Departamento</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por departamento</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Todos</DropdownMenuItem>
            <DropdownMenuItem>Frontend</DropdownMenuItem>
            <DropdownMenuItem>Backend</DropdownMenuItem>
            <DropdownMenuItem>UX/UI</DropdownMenuItem>
            <DropdownMenuItem>QA</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            name: "Ana García",
            role: "Frontend Developer",
            project: "Sistema CRM",
            email: "ana.garcia@accenture.com",
            phone: "+34 612 345 678",
            startDate: "15/01/2023",
            skills: ["React", "TypeScript", "Tailwind"],
            status: "Activo",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
          },
          {
            name: "Carlos López",
            role: "Backend Developer",
            project: "API Gateway",
            email: "carlos.lopez@accenture.com",
            phone: "+34 623 456 789",
            startDate: "03/03/2023",
            skills: ["Node.js", "Python", "AWS"],
            status: "Activo",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
          },
          {
            name: "María Rodríguez",
            role: "UX/UI Designer",
            project: "Portal de Clientes",
            email: "maria.rodriguez@accenture.com",
            phone: "+34 634 567 890",
            startDate: "22/06/2023",
            skills: ["Figma", "Adobe XD", "Sketch"],
            status: "Activo",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
          },
        ].map((member, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {member.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>Proyecto actual: {member.project}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Fecha de inicio: {member.startDate}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Habilidades principales:</p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, i) => (
                      <Badge key={i} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

