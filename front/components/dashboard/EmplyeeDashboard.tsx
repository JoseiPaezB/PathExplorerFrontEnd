"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEmployeeDashboard } from "@/hooks/useDashboardData";

interface EmployeeDashboardProps {
  userName: string;
}

export default function EmployeeDashboard({
  userName,
}: EmployeeDashboardProps) {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(0);
  const {
    teamMembers,
    courses,
    certifications,
    skills,
    employeeProyect,
    isLoading,
    error,
    refreshData,
  } = useEmployeeDashboard();

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
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get remaining days until certification expiration
  const getRemainingDays = (expirationDate: string): number => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter active certifications (not expired)
  const activeCertifications = certifications.filter(
    (cert) =>
      new Date(cert.fecha_vencimiento) > new Date() && cert.estado_validacion
  );

  // Filter courses in progress
  const coursesInProgress = courses.filter(
    (course) =>
      !course.fecha_finalizacion || calculateProgress(course.progreso) < 100
  );

  // Filter completed courses
  const completedCourses = courses.filter(
    (course) =>
      course.fecha_finalizacion && calculateProgress(course.progreso) >= 100
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

  return (
    <div className="space-y-8">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {userName}
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tu actividad y proyectos actuales
        </p>
      </motion.div>

      {/* Sección de Certificaciones y Cursos */}
      <DropdownCard
        title="Desarrollo Profesional"
        isOpen={openDropdownIndex === 0}
        onToggle={() => handleDropdownToggle(0)}
      >
        <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
          {/* Certificaciones Activas */}
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
                {activeCertifications.length > 0 ? (
                  activeCertifications.slice(0, 3).map((cert, index) => {
                    const remainingDays = getRemainingDays(
                      cert.fecha_vencimiento
                    );
                    let badgeColor = "bg-emerald-500";

                    if (remainingDays < 30) {
                      badgeColor = "bg-red-500";
                    } else if (remainingDays < 90) {
                      badgeColor = "bg-amber-500";
                    }

                    return (
                      <div
                        key={`${cert.id_certificacion}-${index}`}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {cert.nombre}
                            </span>
                            <Badge className={`${badgeColor} text-white mr-1`}>
                              {remainingDays} días
                            </Badge>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Vence: {formatDate(cert.fecha_vencimiento)}
                        </span>
                        <Progress
                          value={Math.min(100, (remainingDays / 365) * 100)}
                          className="h-1 bg-muted"
                          indicatorClassName={badgeColor}
                          showAnimation={true}
                          animationDuration={1.5 + index * 0.2}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                    <Award className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No tienes certificaciones activas
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                {activeCertifications.length} certificaciones activas
              </div>
              <Link href="/cursos-y-certificaciones">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-primary group"
                  type="button"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Ver todas</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Cursos En Progreso */}
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center">
                <CardTitle>Cursos En Progreso</CardTitle>
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                Cursos que estás realizando actualmente
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-4">
                {coursesInProgress.length > 0 ? (
                  coursesInProgress.slice(0, 3).map((course, index) => {
                    const progress = calculateProgress(course.progreso);
                    return (
                      <div key={course.id_curso} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {course.nombre}
                          </span>
                          <Badge
                            variant={progress < 50 ? "outline" : "default"}
                          >
                            {course.duracion} horas
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>{course.institucion}</span>
                          <span>{progress}% completado</span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-2"
                          showAnimation={true}
                          animationDuration={1.5 + index * 0.2}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No tienes cursos en progreso
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                {coursesInProgress.length} cursos en progreso
              </div>
              <Link href="/cursos-y-certificaciones">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-primary group"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Ver todos</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Habilidades */}
          <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex justify-between items-center">
                <CardTitle>Habilidades Destacadas</CardTitle>
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>Tus habilidades mejor puntuadas</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-2">
              <div className="space-y-4">
                {skills.length > 0 ? (
                  skills
                    .sort((a, b) => b.nivel_demostrado - a.nivel_demostrado)
                    .slice(0, 5)
                    .map((skill, index) => {
                      const skillPercentage =
                        (skill.nivel_demostrado / skill.nivel_maximo) * 100;
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {skill.nombre}
                            </span>
                            <Badge
                              variant={
                                skill.categoria === "TECNICA"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {skill.categoria}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <Progress
                              value={skillPercentage}
                              className="h-2"
                              showAnimation={true}
                              animationDuration={1.2 + index * 0.2}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{skill.descripcion}</span>
                              <span>
                                Nivel {skill.nivel_demostrado}/
                                {skill.nivel_maximo}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                    <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No hay habilidades registradas
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                {skills.length} habilidades totales
              </div>
              <Link href="/perfil">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-primary group"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Ver todas</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </DropdownCard>

      {/* Vista de proyecto actual del empleado */}
      <DropdownCard
        title="Mi Proyecto Actual"
        isOpen={openDropdownIndex === 1}
        onToggle={() => handleDropdownToggle(1)}
      >
        <motion.div variants={item}>
          {employeeProyect && employeeProyect.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader className="pb-2 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{employeeProyect[0].nombre}</CardTitle>
                        <Badge className="bg-blue-500 text-white">
                          Asignado
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {employeeProyect[0].descripcion}
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
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Ver calendario</DropdownMenuItem>
                        <DropdownMenuItem>Contactar manager</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 px-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Inicio
                        </span>
                        <p className="font-medium">
                          {formatDate(employeeProyect[0].fecha_inicio ?? null)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Fecha límite
                        </span>
                        <p className="font-medium">
                          {formatDate(
                            employeeProyect[0].fecha_fin_estimada ?? null
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t pt-4 px-6">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Prioridad: {employeeProyect[0].prioridad}/5</span>
                  </div>
                  <Link href="/cursos-y-certificaciones">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs text-primary group"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Ver detalles</span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Equipo del Proyecto */}
              <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader className="p-6">
                  <div className="flex justify-between items-center">
                    <CardTitle>Equipo del Proyecto</CardTitle>
                    <Badge className="bg-primary">
                      {employeeProyect[0].nombre}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-2">
                  {teamMembers && teamMembers.length > 0 ? (
                    <div className="space-y-4">
                      {teamMembers.map((member, index) => (
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
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.nombre || "User"
                                    }`}
                                  alt={member.nombre || "Usuario"}
                                />
                                <AvatarFallback>
                                  {(member.nombre || "U").charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {member.nombre || "Usuario"}
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
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                      <Users className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No hay miembros en el equipo
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Link href="/proyecto-actual">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-1 text-primary group"
                    >
                      <span>Ver todo el equipo</span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center rounded-xl border border-dashed bg-muted/30">
              <div className="flex flex-col items-center gap-2 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">
                  No estás asignado a ningún proyecto
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Cuando seas asignado a un proyecto, podrás verlo aquí.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </DropdownCard>

      {/* Sección de cursos completados */}
      <DropdownCard
        title="Cursos Completados Recientemente"
        isOpen={openDropdownIndex === 2}
        onToggle={() => handleDropdownToggle(2)}
      >
        <motion.div variants={item}>
          {completedCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {completedCourses
                .sort((a, b) => {
                  const dateA = a.fecha_finalizacion
                    ? new Date(a.fecha_finalizacion).getTime()
                    : 0;
                  const dateB = b.fecha_finalizacion
                    ? new Date(b.fecha_finalizacion).getTime()
                    : 0;
                  return dateB - dateA;
                })
                .slice(0, 6)
                .map((course, index) => (
                  <motion.div
                    key={course.id_curso}
                    variants={item}
                    custom={index}
                    initial="hidden"
                    animate="show"
                  >
                    <Card className="overflow-hidden border-none shadow-card hover:shadow-elevated transition-all duration-300">
                      <CardHeader className="pb-2 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{course.nombre}</CardTitle>
                            <CardDescription className="mt-1">
                              {course.descripcion}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={course.certificado ? "default" : "outline"}
                            className={
                              course.certificado
                                ? "bg-emerald-500 text-white"
                                : ""
                            }
                          >
                            {course.certificado ? "Certificado" : "Completado"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 px-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <span className="text-xs text-muted-foreground">
                                Institución
                              </span>
                              <p className="font-medium">
                                {course.institucion}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-muted-foreground">
                                Categoría
                              </span>
                              <p className="font-medium">{course.categoria}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-muted-foreground">
                                Duración
                              </span>
                              <p className="font-medium">
                                {course.duracion} horas
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-muted-foreground">
                                Calificación
                              </span>
                              <p className="font-medium">
                                {course.calificacion
                                  ? `${parseFloat(course.calificacion).toFixed(
                                    2
                                  )}%`
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-between border-t pt-4 px-6">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Completado: {formatDate(course.fecha_finalizacion)}
                          </span>
                        </div>
                        <Link href={`/cursos-y-certificaciones/${course.id_curso}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-xs text-primary group"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Ver detalles</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center rounded-xl border border-dashed bg-muted/30">
              <div className="flex flex-col items-center gap-2 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">
                  No hay cursos completados recientemente
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Cuando completes cursos, aparecerán aquí.
                </p>

                <Link href="/cursos-y-certificaciones">
                  <Button variant="outline" className="mt-2 rounded-full">
                    Explorar cursos
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </DropdownCard>
    </div>
  );
}
