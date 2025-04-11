"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  LineChart,
  PieChart,
  Share2,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

export default function AnaliticaPage() {
  const [activeTab, setActiveTab] = useState("rendimiento");

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Analítica y Reportes
          </h1>
          <p className="text-muted-foreground">
            Visualiza métricas y tendencias de rendimiento
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Último mes</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtros</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Exportar</span>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1 bg-primary hover:bg-primary/90"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Compartir</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Proyectos Activos",
            value: "8",
            change: "0%",
            trend: "neutral",
            description: "vs. mes anterior",
          },
          {
            title: "Certificaciones Activas",
            value: "5",
            change: "+1",
            trend: "up",
            description: "vs. mes anterior",
          },
          {
            title: "Objetivos Completados",
            value: "85%",
            change: "-5%",
            trend: "down",
            description: "vs. mes anterior",
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : stat.trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <LineChart className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.trend === "up"
                      ? "text-green-500"
                      : stat.trend === "down"
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }
                >
                  {stat.change}
                </span>{" "}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="rendimiento">Rendimiento</TabsTrigger>
          <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
          <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
        </TabsList>

        <TabsContent value="rendimiento" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Distribución de Tiempo</CardTitle>
                <CardDescription>
                  Porcentaje por tipo de actividad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <PieChart className="mx-auto h-8 w-8 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">
                        Gráfico Circular
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        El gráfico de distribución se visualizará aquí
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Objetivos del Trimestre</CardTitle>
                <CardDescription>Progreso en objetivos clave</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Desarrollo de nuevas funcionalidades",
                      progress: 75,
                    },
                    { name: "Mejora de rendimiento", progress: 60 },
                    { name: "Documentación técnica", progress: 90 },
                    { name: "Code reviews", progress: 85 },
                  ].map((objetivo, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{objetivo.name}</span>
                        <span>{objetivo.progress}%</span>
                      </div>
                      <Progress value={objetivo.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluaciones de Desempeño</CardTitle>
                <CardDescription>
                  Últimas evaluaciones recibidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      project: "Sistema CRM",
                      rating: 4.8,
                      feedback: "Excelente trabajo en la implementación",
                      date: "15/02/2025",
                    },
                    {
                      project: "App Móvil Banca",
                      rating: 4.5,
                      feedback: "Buena comunicación y entrega a tiempo",
                      date: "01/02/2025",
                    },
                    {
                      project: "Portal de Clientes",
                      rating: 4.9,
                      feedback: "Soluciones innovadoras implementadas",
                      date: "20/01/2025",
                    },
                  ].map((evaluation, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-lg bg-muted p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {evaluation.project}
                        </span>
                        <Badge variant="outline">{evaluation.rating}/5.0</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.feedback}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {evaluation.date}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Colaboración en Equipo</CardTitle>
                <CardDescription>Métricas de trabajo en equipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      metric: "Code Reviews Realizados",
                      value: "45",
                      change: "+15%",
                      trend: "up",
                    },
                    {
                      metric: "Pull Requests Mergeados",
                      value: "38",
                      change: "+5%",
                      trend: "up",
                    },
                    {
                      metric: "Tiempo Medio de Respuesta",
                      value: "2h",
                      change: "-25%",
                      trend: "down",
                    },
                    {
                      metric: "Mentorías Realizadas",
                      value: "12",
                      change: "0%",
                      trend: "neutral",
                    },
                  ].map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{metric.metric}</p>
                        <p className="text-sm text-muted-foreground">
                          <span
                            className={
                              metric.trend === "up"
                                ? "text-green-500"
                                : metric.trend === "down"
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }
                          >
                            {metric.change}
                          </span>{" "}
                          vs. mes anterior
                        </p>
                      </div>
                      <div className="text-2xl font-bold">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proyectos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Proyectos</CardTitle>
              <CardDescription>
                Estado y métricas de los proyectos activos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  {
                    name: "Sistema CRM",
                    progress: 65,
                    status: "En progreso",
                    team: 8,
                    deadline: "15/05/2025",
                    tasks: { completed: 45, total: 72 },
                  },
                  {
                    name: "App Móvil Banca",
                    progress: 40,
                    status: "En progreso",
                    team: 12,
                    deadline: "30/06/2025",
                    tasks: { completed: 28, total: 95 },
                  },
                  {
                    name: "Portal de Clientes",
                    progress: 85,
                    status: "En progreso",
                    team: 5,
                    deadline: "10/04/2025",
                    tasks: { completed: 68, total: 74 },
                  },
                ].map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{project.name}</span>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{project.team} miembros</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Fecha límite: {project.deadline}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">
                        {project.tasks.completed}/{project.tasks.total} tareas
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habilidades" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Desarrollo de Habilidades</CardTitle>
                <CardDescription>Progreso en áreas clave</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "JavaScript/TypeScript", level: 90 },
                    { name: "React/Angular", level: 85 },
                    { name: "Node.js", level: 80 },
                    { name: "AWS", level: 75 },
                    { name: "Python", level: 65 },
                    { name: "DevOps/CI/CD", level: 70 },
                  ].map((skill, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver plan de desarrollo
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificaciones y Cursos</CardTitle>
                <CardDescription>
                  Estado de certificaciones y cursos en progreso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "AWS Solutions Architect Professional",
                      type: "Certifications",
                      status: "En progreso",
                      dueDate: "15/04/2025",
                      progress: 40,
                    },
                    {
                      name: "Scrum Master",
                      type: "Certifications",
                      status: "Activa",
                      dueDate: "10/05/2025",
                      progress: 100,
                    },
                    {
                      name: "React Advanced Patterns",
                      type: "Curso",
                      status: "En progreso",
                      dueDate: "20/03/2025",
                      progress: 65,
                    },
                  ].map((cert, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{cert.name}</p>
                          <Badge variant="outline">{cert.type}</Badge>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            cert.status === "Activa"
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }
                        >
                          {cert.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Fecha límite: {cert.dueDate}</span>
                          <span>{cert.progress}% completado</span>
                        </div>
                        <Progress value={cert.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver todas las certificaciones
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
