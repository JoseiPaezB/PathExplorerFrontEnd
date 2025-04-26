"use client";

import { useState, useEffect } from "react";

import {
  Award,
  Briefcase,
  Calendar,
  Edit,
  FileText,
  Flag,
  GraduationCap,
  User,
  Mail,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type {
  CertificationsUserResponse,
  CoursesUserResponse,
  ProfessionalHistory,
  SkillsResponse,
  UserTrajectoryResponse,
} from "@/types/users";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { formatDate } from "@/lib/functions";

export default function PerfilPage() {
  const {
    user,
    professionalHistory: fetchProfessionalHistory,
    courses: fetchCourses,
    certifications: fetchCertifications,
    skills: fetchSkills,
    goalsAndTrajectory: fetchGoalsAndTrajectory,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("informacion");
  const [certifications, setCertifications] =
    useState<CertificationsUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professionalHistoryData, setProfessionalHistoryData] =
    useState<ProfessionalHistory | null>(null);
  const [coursesData, setCoursesData] = useState<CoursesUserResponse | null>(
    null
  );
  const [skills, setSkills] = useState<SkillsResponse>();
  const [goalsAndTrajectory, setGoalsAndTrajectory] =
    useState<UserTrajectoryResponse | null>(null);

  useEffect(() => {
    const loadProfessionalHistory = async () => {
      try {
        const history = await fetchProfessionalHistory();
        if (history) {
          setProfessionalHistoryData(history);
        }
      } catch (error) {
        console.error("Error fetching professional history:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching professional history."
        );
      }
    };

    loadProfessionalHistory();
  }, [fetchProfessionalHistory]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courses = await fetchCourses();
        if (courses) {
          setCoursesData(courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching courses."
        );
      }
    };

    loadCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setIsLoading(true);
        const certificationsData = await fetchCertifications();

        if (certificationsData?.certifications) {
          setCertifications(certificationsData);
        }
      } catch (error) {
        console.error("Error fetching certifications:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching certifications."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCertifications();
  }, [fetchCertifications]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skillsData = await fetchSkills();
        if (skillsData) {
          setSkills(skillsData);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching skills."
        );
      }
    };

    loadSkills();
  }, [fetchSkills]);

  useEffect(() => {
    const loadGoalsAndTrajectory = async () => {
      try {
        const goalsAndTrajectoryData = await fetchGoalsAndTrajectory();
        if (goalsAndTrajectoryData) {
          setGoalsAndTrajectory(goalsAndTrajectoryData);
        }
      } catch (error) {
        console.error("Error fetching goals and trajectory:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching goals and trajectory."
        );
      }
    };
    loadGoalsAndTrajectory();
  }, [fetchGoalsAndTrajectory]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage
                src="/placeholder.svg?height=96&width=96"
                alt="Juan Díaz"
              />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <p className="text-lg text-muted-foreground">{`${user?.profile.puesto_actual}`}</p>
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {" "}
                    {user?.fecha_contratacion &&
                      formatDate(user.fecha_contratacion)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
            <div className="ml-auto flex flex-col gap-2 md:flex-row">
              <Link href="/configuracion">
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Editar perfil
                </Button>
              </Link>

              <Button
                size="sm"
                className="gap-1 bg-primary hover:bg-primary/90"
              >
                <FileText className="h-4 w-4" />
                Descargar CV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
          <TabsTrigger value="metas">Metas Profesionales</TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Cursos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {coursesData && coursesData.courses.length > 0 ? (
                    coursesData.courses.map((course) => (
                      <div key={course.id_curso} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            {course.nombre}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {course.modalidad}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {course.institucion}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        No hay cursos disponibles
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Certificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {certifications &&
                  certifications.certifications.length > 0 ? (
                    certifications.certifications.map((cert) => (
                      <div key={cert.ID_Certificacion} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{cert.Nombre}</h4>
                          <span className="text-xs text-muted-foreground">
                            {cert.Validez}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {cert.Institucion}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        No hay certificaciones disponibles
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Historial Profesional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-16">
                {" "}
                {isLoading ? (
                  <p>Cargando historial profesional...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : professionalHistoryData &&
                  professionalHistoryData.professionalHistory.length > 0 ? (
                  professionalHistoryData.professionalHistory.map(
                    (entry, index) => (
                      <div
                        key={index}
                        className="relative border-l border-muted pl-6 pb-8"
                      >
                        {" "}
                        <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
                        <div className="space-y-4">
                          {" "}
                          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                            <h4 className="font-medium">
                              {entry.role || "Posición no especificada"}
                            </h4>
                          </div>
                          <p className="text-sm font-medium text-primary">
                            {entry.nombre} {entry.apellido}
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {entry.historial}
                          </p>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p>No hay historial profesional disponible</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habilidades" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Habilidades Técnicas
                </CardTitle>
                <CardDescription>
                  Evaluación de competencias técnicas basada en proyectos y
                  certificaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills && skills.skills.length > 0 ? (
                    skills.skills
                      .filter((skill) => skill.categoria === "TECNICA")
                      .map((skill, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {skill.nombre}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {skill.nivel_demostrado}
                            </span>
                          </div>
                          <Progress
                            value={skill.nivel_demostrado * 20}
                            className="h-2"
                          />
                        </div>
                      ))
                  ) : (
                    <p>No hay habilidades técnicas disponibles</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Habilidades Blandas
                </CardTitle>
                <CardDescription>
                  Evaluación de competencias interpersonales basada en feedback
                  de equipo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills && skills.skills.length > 0 ? (
                    skills.skills
                      .filter((skill) => skill.categoria === "BLANDA")
                      .map((skill, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {skill.nombre}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {skill.nivel_demostrado}
                            </span>
                          </div>
                          <Progress
                            value={skill.nivel_demostrado * 20}
                            className="h-2"
                          />
                        </div>
                      ))
                  ) : (
                    <p>No hay habilidades técnicas disponibles</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metas" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Cargando información de carrera...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-red-500">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-primary" />
                  Plan de Carrera
                </CardTitle>
                <CardDescription>
                  Objetivos profesionales y plan de desarrollo a corto y largo
                  plazo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {goalsAndTrajectory?.trajectory &&
                    goalsAndTrajectory.trajectory.map((career, index) => (
                      <div
                        key={career.id_trayectoria}
                        className="relative border-l border-primary pl-6"
                      >
                        <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{career.nombre}</h4>
                            <Badge
                              className={`inline-flex items-center px-3 py-1 whitespace-nowrap ${
                                career.etapa_actual === "Fase inicial"
                                  ? "bg-blue-500 text-white"
                                  : career.etapa_actual === "Fase intermedia"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-purple-500 text-white"
                              }`}
                            >
                              {career.etapa_actual}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {career.descripcion}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progreso</span>
                              <span className="font-medium">
                                {parseFloat(career.progreso).toFixed(1)}%
                              </span>
                            </div>
                            <Progress
                              value={parseFloat(career.progreso)}
                              className="h-2"
                            />
                          </div>
                          <div className="space-y-1 pt-2">
                            <p className="text-sm font-medium">
                              Ruta de Desarrollo:
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {career.roles_secuenciales}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Tiempo estimado: {career.tiempo_estimado} meses
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Fecha de inicio:{" "}
                              {new Date(career.fecha_inicio).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                  <div className="pt-4">
                    <h4 className="font-medium mb-4">Metas Profesionales</h4>
                    {goalsAndTrajectory?.professionalGoals &&
                    goalsAndTrajectory.professionalGoals.length > 0 ? (
                      goalsAndTrajectory.professionalGoals.map((goal) => (
                        <div
                          key={goal.id_meta}
                          className="relative border-l border-muted pl-6 pb-6"
                        >
                          <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-muted" />
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">
                                {goal.descripcion}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`${
                                  goal.estado === "CANCELADA"
                                    ? "bg-red-50 text-red-700"
                                    : goal.estado === "COMPLETADA"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {goal.estado}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Establecida:{" "}
                                {new Date(
                                  goal.fecha_establecimiento
                                ).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Plazo:{" "}
                              {goal.plazo === "LARGO"
                                ? "Largo plazo"
                                : goal.plazo === "MEDIO"
                                ? "Medio plazo"
                                : "Corto plazo"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Prioridad: {goal.prioridad}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay metas profesionales definidas.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
