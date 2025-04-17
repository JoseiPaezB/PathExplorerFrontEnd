"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  MoreHorizontal,
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Mail,
  ChevronRight,
  CheckCircle,
  InfoIcon,
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
import DropdownCard from "@/components/ui/dropdown";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const [asignacionValue] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activos");
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();
  const [openDropdownIndex, setOpenDropdownIndex] = useState(0);

  const handleDropdownToggle = (index: number) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(-1);
    } else {
      setOpenDropdownIndex(index);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const ShimmerCard = () => (
    <div className="rounded-xl border border-border/50 bg-card/50 shadow-sm overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-2/3 rounded-md bg-muted/80 animate-pulse" />
        <div className="h-32 rounded-md bg-muted/60 animate-pulse" />
      </div>
      <div className="border-t p-4">
        <div className="h-4 w-full rounded-md bg-muted/70 animate-pulse" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-1/4 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-1/2 rounded-md bg-muted/80 animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </div>
        <div className="space-y-4">
          <div className="h-10 w-1/3 rounded-md bg-muted/80 animate-pulse" />
          <div className="grid gap-6 md:grid-cols-3">
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tu actividad y proyectos actuales
        </p>
      </motion.div>

      <DropdownCard
        title="Gestión y Desempeño"
        isOpen={openDropdownIndex === 0} // El primer dropdown siempre está abierto por defecto
        onToggle={() => handleDropdownToggle(0)}
      >
        <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/90 to-primary p-6 pb-14">
              <CardTitle className="text-white">
                Asignación en Proyectos
              </CardTitle>
              <CardDescription className="text-white/80">
                Porcentaje de tiempo asignado
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 -mt-10">
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40 flex items-center justify-center">
                  <svg
                    className="h-full w-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      className="stroke-black/5 stroke-[8] fill-none"
                      cx="50"
                      cy="50"
                      r="40"
                    />
                    <motion.circle
                      className="stroke-[#C266FF]   stroke-[8] fill-none"
                      cx="50"
                      cy="50"
                      r="40"
                      strokeDasharray="251.2"
                      strokeDashoffset="251.2"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{
                        strokeDashoffset: 251.2 - asignacionValue * 2.51,
                      }}
                      transition={{
                        duration: 1.5,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      className="flex flex-col items-center justify-center bg-white rounded-full h-28 w-28 shadow-sm"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <motion.span
                        className="text-3xl font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        {asignacionValue}%
                      </motion.span>
                      <span className="text-sm text-muted-foreground">
                        Asignado
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                Último proyecto: Sistema CRM
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-primary group"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Ver detalles</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center">
                <CardTitle>Certificaciones</CardTitle>
                <Award className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                Estado de tus certificaciones activas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-small">
                        AWS Solutions Architect
                      </span>
                      <Badge className="bg-amber-500 text-white mr-1">
                        30 días
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground gap-3">
                    Vence: 15/04/2025
                  </span>

                  <Progress
                    value={25}
                    className="h-1 bg-muted"
                    indicatorClassName="bg-amber-500"
                    showAnimation={true}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium block text-center">
                        Scrum Master
                      </span>
                      <Badge className="bg-emerald-500 text-white mr-2 flex items-center">
                        60 días
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Vence: 10/05/2025
                  </span>

                  <Progress
                    value={50}
                    className="h-1 bg-muted"
                    indicatorClassName="bg-emerald-500"
                    showAnimation={true}
                    animationDuration={1.8}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        React Advanced
                      </span>
                      <Badge
                        variant="outline"
                        className="text-muted-foreground mr-2"
                      >
                        120 días
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Vence: 22/08/2025
                  </span>

                  <Progress
                    value={75}
                    className="h-1"
                    showAnimation={true}
                    animationDuration={2}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                3 certificaciones activas
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-primary group"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Ver todas</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center">
                <CardTitle>Métricas Clave</CardTitle>
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>Resumen de tu rendimiento</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-4">
                {[
                  {
                    label: "Horas Facturables",
                    value: "160h",
                    target: "200h",
                    percent: 80,
                    trend: "up",
                  },
                  {
                    label: "Objetivos Completados",
                    value: "7/10",
                    target: "10",
                    percent: 70,
                    trend: "neutral",
                  },
                  {
                    label: "Satisfacción del Cliente",
                    value: "4.8/5",
                    target: "4.5/5",
                    percent: 96,
                    trend: "up",
                  },
                ].map((metric, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {metric.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold">
                          {metric.value}
                        </span>
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        ) : metric.trend === "down" ? (
                          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress
                        value={metric.percent}
                        className="h-2"
                        showAnimation={true}
                        animationDuration={1.5 + index * 0.2}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Meta: {metric.target}</span>
                        <span>{metric.percent}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                Último trimestre
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-primary group"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Ver informe completo</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DropdownCard>

      <DropdownCard
        title="Actividad y progreso de proyectos"
        isOpen={openDropdownIndex === 1} // El segundo dropdown se controla por estado
        onToggle={() => handleDropdownToggle(1)}
      >
        <motion.div variants={item}>
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-muted/50 p-1 rounded-full">
                <TabsTrigger
                  value="activos"
                  className="rounded-full px-4 text-sm"
                >
                  Proyectos Activos
                </TabsTrigger>
                <TabsTrigger
                  value="proximos"
                  className="rounded-full px-4 text-sm"
                >
                  Próximos
                </TabsTrigger>
                <TabsTrigger
                  value="completados"
                  className="rounded-full px-4 text-sm"
                >
                  Completados
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 rounded-full shadow-button hover:shadow-button-hover transition-all"
            >
              Ver todos los proyectos
            </Button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "activos" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Sistema CRM",
                      description:
                        "Desarrollo de módulos de ventas y marketing",
                      progress: 65,
                      role: "Desarrollador Frontend",
                      dueDate: "15/05/2025",
                      team: 8,
                      status: "En progreso",
                    },
                    {
                      title: "Portal de Clientes",
                      description: "Diseño e implementación de portal web",
                      progress: 42,
                      role: "Desarrollador Full Stack",
                      dueDate: "30/06/2025",
                      team: 5,
                      status: "En progreso",
                    },
                    {
                      title: "App Móvil Banca",
                      description: "Desarrollo de aplicación móvil para banca",
                      progress: 78,
                      role: "Desarrollador Frontend",
                      dueDate: "10/04/2025",
                      team: 6,
                      status: "En revisión",
                    },
                  ].map((project, index) => (
                    <motion.div
                      key={project.title}
                      variants={item}
                      custom={index}
                      initial="hidden"
                      animate="show"
                      className="card-interactive"
                    >
                      <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
                        <CardHeader className="pb-2 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <CardTitle>{project.title}</CardTitle>
                                <Badge
                                  className={
                                    project.status === "En progreso"
                                      ? "bg-blue-500 text-white"
                                      : "bg-amber-500 text-white"
                                  }
                                >
                                  {project.status}
                                </Badge>
                              </div>
                              <CardDescription className="mt-1">
                                {project.description}
                              </CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Opciones</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem>
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Editar proyecto
                                </DropdownMenuItem>
                                <DropdownMenuItem>Ver equipo</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2 px-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progreso</span>
                                <span className="font-medium">
                                  {project.progress}%
                                </span>
                              </div>
                              <Progress
                                value={project.progress}
                                className="h-2"
                                showAnimation={true}
                                animationDuration={1.5 + index * 0.2}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">
                                  Rol
                                </span>
                                <p className="font-medium">{project.role}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">
                                  Fecha límite
                                </span>
                                <p className="font-medium">{project.dueDate}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="justify-between border-t pt-4 px-6">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>Equipo: {project.team} personas</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-xs text-primary group"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Ver calendario</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
              {activeTab === "proximos" && (
                <div className="flex h-60 items-center justify-center rounded-xl border border-dashed bg-muted/30">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium">
                      No hay proyectos próximos
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Los proyectos próximos aparecerán aquí cuando estén
                      programados. Puedes crear un nuevo proyecto desde el panel
                      de administración.
                    </p>
                    <Button variant="outline" className="mt-2 rounded-full">
                      Crear proyecto
                    </Button>
                  </div>
                </div>
              )}
              {activeTab === "completados" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Migración a la Nube",
                      description: "Migración de infraestructura a AWS",
                      role: "DevOps Engineer",
                      completedDate: "10/01/2025",
                      team: 6,
                    },
                  ].map((project, index) => (
                    <motion.div
                      key={project.title}
                      variants={item}
                      custom={index}
                      initial="hidden"
                      animate="show"
                    >
                      <Card className="overflow-hidden border-none shadow-card bg-muted/30">
                        <CardHeader className="pb-2 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription className="mt-1">
                                {project.description}
                              </CardDescription>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-muted text-muted-foreground"
                            >
                              Completado
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2 px-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progreso</span>
                                <span className="font-medium">100%</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">
                                  Rol
                                </span>
                                <p className="font-medium">{project.role}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">
                                  Fecha completado
                                </span>
                                <p className="font-medium">
                                  {project.completedDate}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="justify-between border-t pt-4 px-6">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>Equipo: {project.team} personas</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-xs text-primary group"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Ver informe</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DropdownCard>

      <DropdownCard
        title="Colaboración y Avances"
        isOpen={openDropdownIndex === 2} // El segundo dropdown se controla por estado
        onToggle={() => handleDropdownToggle(2)}
      >
        <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-4">
                {[
                  {
                    title: "Certificación completada",
                    description:
                      "Has completado la certificación de React Avanzado",
                    time: "Hace 2 días",
                    icon: Award,
                    color: "text-amber-600",
                    type: "success",
                  },
                  {
                    title: "Nuevo proyecto asignado",
                    description:
                      "Has sido asignado al proyecto Portal de Clientes",
                    time: "Hace 1 semana",
                    icon: Briefcase,
                    color: "text-blue-600",
                    type: "info",
                  },
                  {
                    title: "Evaluación de desempeño",
                    description:
                      "Tu manager ha completado tu evaluación trimestral",
                    time: "Hace 2 semanas",
                    icon: FileText,
                    color: "text-green-600",
                    type: "success",
                  },
                  {
                    title: "Curso recomendado",
                    description:
                      "Se te ha recomendado el curso de AWS Solutions Architect",
                    time: "Hace 3 semanas",
                    icon: BookOpen,
                    color: "text-purple-600",
                    type: "info",
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4 rounded-xl p-3 transition-colors hover:bg-muted/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div
                      className={`mt-0.5 rounded-full py-4 px-3 flex items-center justify-center ${activity.color}`}
                    >
                      {activity.type === "success" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : activity.type === "info" ? (
                        <InfoIcon className="h-5 w-5" />
                      ) : (
                        <activity.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <div className="flex items-center pt-1">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-1 text-primary group"
              >
                <span>Ver toda la actividad</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Equipo del Proyecto</CardTitle>
                <Badge className="bg-primary">Sistema CRM</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-4">
                {[
                  {
                    name: "Juan Díaz",
                    role: "Project Manager",
                    avatar:
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
                    status: "online",
                  },
                  {
                    name: "María López",
                    role: "Backend Developer",
                    avatar:
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
                    status: "offline",
                  },
                  {
                    name: "Carlos Ruiz",
                    role: "UX Designer",
                    avatar:
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
                    status: "online",
                  },
                  {
                    name: "Ana García",
                    role: "Frontend Developer",
                    avatar:
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
                    status: "online",
                  },
                ].map((member, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-muted/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            member.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Enviar mensaje</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-1 text-primary group"
              >
                <span>Ver todo el equipo</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DropdownCard>
    </motion.div>
  );
}
