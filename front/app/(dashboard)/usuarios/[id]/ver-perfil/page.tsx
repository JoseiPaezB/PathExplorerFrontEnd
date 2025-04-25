"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Briefcase,
  Calendar,
  Flag,
  GraduationCap,
  User,
  ArrowLeft,
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
import { UserInfoBanca } from "@/types/users";
import { params } from "@/types/parameters";
import {
  getUserCertifications,
  getUserCourses,
  getUserSkills,
  getUserProfessionalHistory,
  getUserTrajectoryAndGoals,
} from "./actions";
import {
  CoursesUserResponse,
  CertificationsUserResponse,
  UserTrajectoryResponse,
  ProfessionalHistory,
  SkillsResponse,
} from "@/types/users";

export default function UserDetailsPage({ params }: { params: params }) {
  const unwrappedParams: params = use(params);
  const userId = unwrappedParams.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("informacion");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfoBanca | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CoursesUserResponse | null>(null);
  const [certifications, setCertifications] =
    useState<CertificationsUserResponse | null>(null);
  const [professionalHistory, setProfessionalHistory] =
    useState<ProfessionalHistory | null>(null);
  const [userTrajectory, setUserTrajectory] =
    useState<UserTrajectoryResponse | null>(null);
  const [skills, setSkills] = useState<SkillsResponse | null>(null);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("selectedUser");
      setLoading(true);

      if (storedUser) {
        const userData = JSON.parse(storedUser) as UserInfoBanca;
        if (userData.id_persona.toString() === userId) {
          setUser(userData);
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Error parsing user data");
      console.error("Error retrieving user data:", err);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const userCoursesData = await getUserCourses(userId, token);
        setCourses(userCoursesData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error parsing user data");
        console.error("Error fetching user courses:", error);
      }
    };

    fetchUserCourses();
  }, [userId]);

  useEffect(() => {
    const fetchUserCertifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const userCertificationsData = await getUserCertifications(
          userId,
          token
        );
        setCertifications(userCertificationsData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error parsing user data");

        console.error("Error fetching user certifications:", error);
      }
    };

    fetchUserCertifications();
  }, [userId]);

  useEffect(() => {
    const fetchUserTrajectory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const response = await getUserTrajectoryAndGoals(userId, token);
        setUserTrajectory(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error parsing user data");
        console.error("Error fetching user trajectory:", error);
      }
    };

    fetchUserTrajectory();
  }, [userId]);

  useEffect(() => {
    const fetchProfessionalHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const response = await getUserProfessionalHistory(userId, token);
        setProfessionalHistory(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error parsing user data");
        console.error("Error fetching professional history:", error);
      }
    };

    fetchProfessionalHistory();
  }, [userId]);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const response = await getUserSkills(userId, token);
        setSkills(response);
        setIsLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error parsing user data");
        console.error("Error fetching user skills:", error);
      }
    };

    fetchUserSkills();
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a usuarios</span>
        </Button>
      </div>
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
              <p className="text-lg text-muted-foreground">{`${user?.puesto_actual}`}</p>
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {" "}
                    {user?.fecha_contratacion &&
                      new Date(user.fecha_contratacion).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                        }
                      )}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
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
                  {courses && courses.courses.length > 0 ? (
                    courses.courses.map((course) => (
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
                ) : professionalHistory &&
                  professionalHistory.professionalHistory.length > 0 ? (
                  professionalHistory.professionalHistory.map(
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
                  {userTrajectory?.trajectory &&
                    userTrajectory.trajectory.map((career, index) => (
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
                    {userTrajectory?.professionalGoals &&
                    userTrajectory.professionalGoals.length > 0 ? (
                      userTrajectory.professionalGoals.map((goal) => (
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
