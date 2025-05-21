"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  MoreHorizontal,
  Users,
  Briefcase,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
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
import { useManagerDashboard } from "@/hooks/useDashboardData";

interface ManagerDashboardProps {
  userName: string;
}

export default function ManagerDashboard({ userName }: ManagerDashboardProps) {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("activos");
  
  const { 
    rolesWithoutAssignments, 
    courses, 
    certifications, 
    skills, 
    isLoading, 
    error, 
    refreshData 
  } = useManagerDashboard();

  const handleDropdownToggle = (index: number) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(-1);
    } else {
      setOpenDropdownIndex(index);
    }
  };

  // Calculate progress for in-progress courses
  const calculateProgress = (progreso: string): number => {
    const progress = parseFloat(progreso);
    return isNaN(progress) ? 0 : progress;
  };

  // Format date to readable string
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Get remaining days until certification expiration
  const getRemainingDays = (expirationDate: string): number => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter active certifications (not expired)
  const activeCertifications = certifications.filter(cert => 
    new Date(cert.fecha_vencimiento) > new Date() && 
    cert.estado_validacion
  );

  // Filter courses in progress
  const coursesInProgress = courses.filter(course => 
    !course.fecha_finalizacion || 
    calculateProgress(course.progreso) < 100
  );

  // Define animation variants
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

  // Count roles needing assignments by priority
  const highPriorityRoles = rolesWithoutAssignments
    .filter(p => p.prioridad >= 4 && p.estado !== 'FINALIZADO')
    .reduce((acc, project) => acc + project.roles.filter(r => r !== null).length, 0);
  
  const totalRolesNeeded = rolesWithoutAssignments
    .filter(p => p.estado !== 'FINALIZADO')
    .reduce((acc, project) => acc + project.roles.filter(r => r !== null).length, 0);

  return (
    <div className="space-y-8">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {userName}
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de los proyectos y recursos a tu cargo
        </p>
      </motion.div>

      {/* Resumen de gestión */}
      <DropdownCard
        title="Resumen de Gestión"
        isOpen={openDropdownIndex === 0}
        onToggle={() => handleDropdownToggle(0)}
      >
        <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
          {/* Asignaciones pendientes */}
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/90 to-primary p-6 pb-14">
              <CardTitle className="text-white">
                Roles por Asignar
              </CardTitle>
              <CardDescription className="text-white/80">
                Resumen de roles disponibles
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
                      className="stroke-[#C266FF] stroke-[8] fill-none"
                      cx="50"
                      cy="50"
                      r="40"
                      strokeDasharray="251.2"
                      strokeDashoffset="251.2"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{
                        strokeDashoffset: totalRolesNeeded > 0 
                          ? 251.2 - (highPriorityRoles / totalRolesNeeded * 100) * 2.51
                          : 0,
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
                        {totalRolesNeeded}
                      </motion.span>
                      <span className="text-sm text-muted-foreground">
                        Roles
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                {highPriorityRoles} roles de alta prioridad
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-primary group"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Gestionar roles</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>

          {/* Proyectos activos */}
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center">
                <CardTitle>Estado de Proyectos</CardTitle>
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                Resumen de proyectos por estado
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-4">
                {[
                  {
                    label: "Proyectos Activos",
                    count: rolesWithoutAssignments.filter(p => p.estado === 'ACTIVO').length,
                    total: rolesWithoutAssignments.length,
                    color: "bg-blue-500"
                  },
                  {
                    label: "En Planificación",
                    count: rolesWithoutAssignments.filter(p => p.estado === 'PLANEACION').length,
                    total: rolesWithoutAssignments.length,
                    color: "bg-amber-500"
                  },
                  {
                    label: "Finalizados",
                    count: rolesWithoutAssignments.filter(p => p.estado === 'FINALIZADO').length,
                    total: rolesWithoutAssignments.length,
                    color: "bg-emerald-500"
                  }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      <Badge className={`${item.color} text-white`}>
                        {item.count}
                      </Badge>
                    </div>
                    <Progress
                      value={(item.count / (item.total || 1)) * 100}
                      className="h-2 bg-muted"
                      indicatorClassName={item.color}
                      showAnimation={true}
                      animationDuration={1.5 + index * 0.2}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {Math.round((item.count / (item.total || 1)) * 100)}% del total
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                {rolesWithoutAssignments.length} proyectos en total
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-primary group"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Ver análisis</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>

          {/* Certificaciones del equipo */}
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center">
                <CardTitle>Mi Desarrollo</CardTitle>
                <Award className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>Certificaciones y habilidades</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-4">
                {activeCertifications.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Mis Certificaciones</h4>
                    {activeCertifications.slice(0, 2).map((cert, index) => {
                      const remainingDays = getRemainingDays(cert.fecha_vencimiento);
                      let badgeColor = "bg-emerald-500";
                      
                      if (remainingDays < 30) {
                        badgeColor = "bg-red-500";
                      } else if (remainingDays < 90) {
                        badgeColor = "bg-amber-500";
                      }
                      
                      return (
                        <div key={`${cert.id_certificacion}-${index}`} className="p-2 rounded-lg bg-muted/40">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{cert.nombre}</span>
                            <Badge className={`${badgeColor} text-white mr-1`}>
                              {remainingDays} días
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Vence: {formatDate(cert.fecha_vencimiento)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-muted/40">
                    <p className="text-sm text-center text-muted-foreground">
                      No tienes certificaciones activas
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Mis Habilidades Destacadas</h4>
                  {skills.length > 0 ? (
                    skills
                      .sort((a, b) => b.nivel_demostrado - a.nivel_demostrado)
                      .slice(0, 3)
                      .map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                          <span className="text-sm">{skill.nombre}</span>
                          <Badge variant={skill.categoria === 'TECNICA' ? 'default' : 'outline'}>
                            {skill.nivel_demostrado}/{skill.nivel_maximo}
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <div className="p-2 rounded-lg bg-muted/40">
                      <p className="text-sm text-center text-muted-foreground">
                        No hay habilidades registradas
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                {skills.length} habilidades registradas
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-primary group"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Ver mi perfil</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DropdownCard>

      {/* Roles sin asignaciones */}
      <DropdownCard
        title="Roles sin Asignaciones"
        isOpen={openDropdownIndex === 1}
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
                  value="planeacion"
                  className="rounded-full px-4 text-sm"
                >
                  En Planeación
                </TabsTrigger>
                <TabsTrigger
                  value="finalizados"
                  className="rounded-full px-4 text-sm"
                >
                  Finalizados
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
              {rolesWithoutAssignments
                .filter(project => {
                  if (activeTab === "activos") return project.estado === "ACTIVO";
                  if (activeTab === "planeacion") return project.estado === "PLANEACION";
                  if (activeTab === "finalizados") return project.estado === "FINALIZADO";
                  return true;
                })
                .length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rolesWithoutAssignments
                    .filter(project => {
                      if (activeTab === "activos") return project.estado === "ACTIVO";
                      if (activeTab === "planeacion") return project.estado === "PLANEACION";
                      if (activeTab === "finalizados") return project.estado === "FINALIZADO";
                      return true;
                    })
                    .map((project, projectIndex) => (
                      <motion.div
                        key={project.id_proyecto}
                        variants={item}
                        custom={projectIndex}
                        initial="hidden"
                        animate="show"
                        className="card-interactive"
                      >
                        <Card className={`overflow-hidden border-none shadow-card transition-all duration-300 ${
                          project.estado === "FINALIZADO" ? "bg-muted/30" : "hover:shadow-elevated"
                        }`}>
                          <CardHeader className="pb-2 p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle>{project.nombre}</CardTitle>
                                  <Badge
                                    className={
                                      project.estado === "ACTIVO"
                                        ? "bg-blue-500 text-white"
                                        : project.estado === "PLANEACION"
                                        ? "bg-amber-500 text-white"
                                        : "bg-muted text-muted-foreground"
                                    }
                                  >
                                    {project.estado === "ACTIVO" 
                                      ? "Activo" 
                                      : project.estado === "PLANEACION"
                                      ? "Planeación"
                                      : "Finalizado"}
                                  </Badge>
                                </div>
                                <CardDescription className="mt-1">
                                  {project.descripcion}
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
                                  <DropdownMenuItem>Asignar roles</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2 px-6">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <div className="text-sm font-medium">
                                  Roles sin asignar: {project.roles.filter(r => r !== null).length}
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">
                                      Inicio
                                    </span>
                                    <p className="font-medium">{formatDate(project.fecha_inicio)}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">
                                      Fecha límite
                                    </span>
                                    <p className="font-medium">{formatDate(project.fecha_fin_estimada)}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Roles disponibles:</h4>
                                <div className="space-y-2">
                                  {project.roles.filter(r => r !== null).slice(0, 2).map((role, roleIndex) => (
                                    role && (
                                      <div key={roleIndex} className="p-2 rounded-lg bg-muted/40 text-sm">
                                        <div className="font-medium">{role.titulo}</div>
                                        <p className="text-xs text-muted-foreground">{role.descripcion}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {role.skills.slice(0, 2).map((skill, skillIndex) => (
                                            <Badge key={skillIndex} variant="outline" className="text-xs">
                                              {skill.nombre} (Niv. {skill.nivel_minimo_requerido})
                                            </Badge>
                                          ))}
                                          {role.skills.length > 2 && (
                                            <Badge variant="outline" className="text-xs">
                                              +{role.skills.length - 2} más
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  ))}
                                  {project.roles.filter(r => r !== null).length > 2 && (
                                    <div className="text-xs text-muted-foreground text-center">
                                      + {project.roles.filter(r => r !== null).length - 2} roles más
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="justify-between border-t pt-4 px-6">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Briefcase className="h-3.5 w-3.5" />
                              <span>Prioridad: {project.prioridad}/5</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-xs text-primary group"
                            >
                              <Users className="h-3.5 w-3.5" />
                              <span>Asignar roles</span>
                              <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <div className="flex h-60 items-center justify-center rounded-xl border border-dashed bg-muted/30">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium">
                      No hay proyectos {activeTab === "activos" ? "activos" : activeTab === "planeacion" ? "en planeación" : "finalizados"} con roles sin asignar
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Los proyectos con roles sin asignar aparecerán aquí.
                    </p>
                    <Button variant="outline" className="mt-2 rounded-full">
                      Crear nuevo proyecto
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DropdownCard>

      {/* Dashboard de Gestión de Recursos */}
      <DropdownCard
        title="Gestión de Recursos"
        isOpen={openDropdownIndex === 2}
        onToggle={() => handleDropdownToggle(2)}
      >
        <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
          {/* Búsqueda de talentos */}
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center">
                <CardTitle>Búsqueda de Talentos</CardTitle>
                <Search className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                Encuentra candidatos para tus roles disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-4">
                {/* Recomendaciones de habilidades más solicitadas */}
                <div className="p-4 rounded-lg bg-muted/40">
                  <h4 className="text-sm font-medium mb-2">Habilidades más solicitadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "AWS", count: 8 },
                      { name: "React", count: 6 },
                      { name: "Angular", count: 5 },
                      { name: "Spring Boot", count: 4 },
                      { name: "Azure", count: 4 },
                      { name: "Docker", count: 3 },
                    ].map((skill, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {skill.name}
                        <span className="bg-primary/20 rounded-full text-xs px-1.5 py-0.5">
                          {skill.count}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Roles prioritarios */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Roles prioritarios para cubrir</h4>
                  <div className="space-y-2">
                    {rolesWithoutAssignments
                      .filter(p => p.estado !== 'FINALIZADO' && p.prioridad >= 4)
                      .slice(0, 2)
                      .flatMap(project => (
                        project.roles
                          .filter(r => r !== null)
                          .slice(0, 2)
                          .map((role, roleIndex) => (
                            role && (
                              <div key={`${project.id_proyecto}-${roleIndex}`} className="p-3 rounded-lg bg-muted/40 text-sm border-l-4 border-amber-500">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{role.titulo}</span>
                                  <Badge className="bg-amber-500 text-white">
                                    Prioridad {project.prioridad}/5
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Proyecto: {project.nombre}</p>
                                <div className="flex items-center gap-1 mt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-primary"
                                  >
                                    <Search className="h-3 w-3 mr-1" />
                                    Buscar candidatos
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm" 
                                    className="h-7 px-2 text-xs text-primary"
                                  >
                                    <Users className="h-3 w-3 mr-1" />
                                    Ver recomendados
                                  </Button>
                                </div>
                              </div>
                            )
                          ))
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-1 text-primary group"
              >
                <span>Abrir buscador de talentos</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>

          {/* Próximas certificaciones a vencer */}
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center">
                <CardTitle>Próximas Renovaciones</CardTitle>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <CardDescription>
                Certificaciones del equipo cercanas a vencer
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-4">
                {/* Lista de empleados con certificaciones a vencer */}
                <div className="space-y-3">
                  {[
                    { 
                      nombre: "Ana García",
                      certificacion: "AWS Solutions Architect",
                      diasRestantes: 15,
                      avatar: "Ana"
                    },
                    { 
                      nombre: "Carlos Ruiz",
                      certificacion: "Scrum Master",
                      diasRestantes: 22,
                      avatar: "Carlos"
                    },
                    { 
                      nombre: "Juan Pérez",
                      certificacion: "Azure Administrator",
                      diasRestantes: 30,
                      avatar: "Juan"
                    },
                  ].map((empleado, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                            {empleado.avatar.charAt(0)}
                          </div>
                          {empleado.diasRestantes < 20 && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                              !
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{empleado.nombre}</p>
                        <p className="text-xs text-muted-foreground truncate">{empleado.certificacion}</p>
                      </div>
                      <Badge className={
                        empleado.diasRestantes < 15 
                          ? "bg-red-500 text-white" 
                          : empleado.diasRestantes < 30 
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-500 text-white"
                      }>
                        {empleado.diasRestantes} días
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Clock className="h-3.5 w-3.5 mr-2" />
                    Programar recordatorios
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    Ver calendario de renovaciones
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-1 text-primary group"
              >
                <span>Gestionar certificaciones del equipo</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DropdownCard>

      {/* Sección de reportes */}
      <DropdownCard
        title="Reportes y Analíticas"
        isOpen={openDropdownIndex === 3}
        onToggle={() => handleDropdownToggle(3)}
      >
        <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
          {/* Tarjetas de informes disponibles */}
          {[
            {
              title: "Asignación de Recursos",
              description: "Análisis de asignación de personal por proyecto",
              icon: Users,
              color: "text-blue-500"
            },
            {
              title: "Desarrollo del Equipo",
              description: "Progreso en cursos y certificaciones",
              icon: Award,
              color: "text-emerald-500"
            },
            {
              title: "Rendimiento de Proyectos",
              description: "Métricas de tiempos y cumplimiento",
              icon: BarChart3,
              color: "text-purple-500"
            },
          ].map((report, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
              <CardHeader className="p-6">
                <div className="flex justify-between items-center">
                  <CardTitle>{report.title}</CardTitle>
                  <report.icon className={`h-6 w-6 ${report.color}`} />
                </div>
                <CardDescription>
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-2">
                <div className="h-32 rounded-lg bg-muted/30 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Vista previa del informe
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1 text-primary group"
                >
                  <span>Ver informe completo</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </motion.div>
      </DropdownCard>
    </div>
  );
}