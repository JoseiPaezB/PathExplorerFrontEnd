"use client"

import { useState } from "react"
import {
  Award,
  BookOpen,
  ChevronDown,
  Clock,
  Filter,
  GraduationCap,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Timer,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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


export default function CursosPage() {
  
  const [activeTab, setActiveTab] = useState("en-curso")
  const { user, isAuthenticated } = useAuth();
      const router = useRouter();
  
      
          
          useEffect(() => {
             // Check if user has manager role
             if (isAuthenticated && user && user.role !== 'administrador' && user.role !== 'empleado') {
               console.log("Unauthorized access to proyectos page");
               router.push('/unauthorized');
            }
           }, [user, isAuthenticated, router]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cursos y Certificaciones</h1>
          <p className="text-muted-foreground">
            Gestiona tu desarrollo profesional y mantén tus certificaciones al día
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrar</span>
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90">
            <Plus className="h-3.5 w-3.5" />
            <span>Nuevo Curso</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cursos..."
            className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>Categoría</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por categoría</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Todas</DropdownMenuItem>
            <DropdownMenuItem>Desarrollo</DropdownMenuItem>
            <DropdownMenuItem>Cloud Computing</DropdownMenuItem>
            <DropdownMenuItem>DevOps</DropdownMenuItem>
            <DropdownMenuItem>Soft Skills</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="en-curso">En Curso</TabsTrigger>
          <TabsTrigger value="completados">Completados</TabsTrigger>
          <TabsTrigger value="certificaciones">Certificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="en-curso" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AWS Solutions Architect Professional",
                description: "Preparación para la certificación AWS Solutions Architect Professional",
                progress: 40,
                category: "Cloud Computing",
                timeLeft: "20 días",
                duration: "40 horas",
                nextLesson: "Alta Disponibilidad y Tolerancia a Fallos",
              },
              {
                title: "React Advanced Patterns",
                description: "Patrones avanzados de React y mejores prácticas",
                progress: 65,
                category: "Desarrollo",
                timeLeft: "15 días",
                duration: "25 horas",
                nextLesson: "Render Props y HOCs",
              },
              {
                title: "Liderazgo Técnico",
                description: "Habilidades de liderazgo para roles técnicos senior",
                progress: 25,
                category: "Soft Skills",
                timeLeft: "30 días",
                duration: "20 horas",
                nextLesson: "Gestión de Equipos Distribuidos",
              },
            ].map((course, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Continuar curso</DropdownMenuItem>
                        <DropdownMenuItem>Descargar recursos</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{course.category}</Badge>
                      <span className="font-medium">{course.progress}% completado</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Tiempo restante: {course.timeLeft}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Timer className="h-4 w-4" />
                      <span>Duración: {course.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                    <Play className="h-4 w-4" />
                    Continuar: {course.nextLesson}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completados" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Docker y Kubernetes",
                description: "Fundamentos de contenedores y orquestación",
                completionDate: "15/01/2025",
                category: "DevOps",
                duration: "30 horas",
                grade: "95%",
              },
              {
                title: "TypeScript Avanzado",
                description: "Tipos avanzados y patrones de diseño",
                completionDate: "20/12/2024",
                category: "Desarrollo",
                duration: "20 horas",
                grade: "90%",
              },
            ].map((course, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-muted">
                      Completado
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Categoría</span>
                      <p className="font-medium">{course.category}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Duración</span>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Fecha completado</span>
                      <p className="font-medium">{course.completionDate}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Calificación</span>
                      <p className="font-medium">{course.grade}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Ver certificado
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificaciones" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AWS Solutions Architect Associate",
                issuer: "Amazon Web Services",
                validUntil: "15/04/2025",
                status: "Activa",
                credentialId: "AWS-SAA-123456",
                skills: ["Cloud Architecture", "AWS Services", "Security"],
              },
              {
                title: "Professional Scrum Master I",
                issuer: "Scrum.org",
                validUntil: "10/05/2025",
                status: "Activa",
                credentialId: "PSM-I-987654",
                skills: ["Agile", "Scrum", "Project Management"],
              },
              {
                title: "Microsoft Azure Administrator",
                issuer: "Microsoft",
                validUntil: "22/12/2024",
                status: "Por renovar",
                credentialId: "AZ-104-456789",
                skills: ["Azure", "Cloud Administration", "Security"],
              },
            ].map((cert, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{cert.title}</CardTitle>
                      <CardDescription>{cert.issuer}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        cert.status === "Activa" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                      }
                    >
                      {cert.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Válida hasta:</span>
                      <span className="font-medium">{cert.validUntil}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">ID Credencial:</span>
                      <span className="font-medium">{cert.credentialId}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Habilidades validadas:</span>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((skill, i) => (
                        <Badge key={i} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 border-t pt-4">
                  <Button variant="outline" className="gap-2">
                    <Award className="h-4 w-4" />
                    Ver credencial
                  </Button>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <BookOpen className="h-4 w-4" />
                    Renovar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

