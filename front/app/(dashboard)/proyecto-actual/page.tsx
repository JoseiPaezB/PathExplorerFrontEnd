"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ProjectsAndRoles } from "@/types/projectsAndRoles";
import { UserInfoBanca } from "@/types/users";

interface TeamMember {
  id_empleado?: number;
  nombre_empleado?: string;
  titulo_rol?: string;
  email?: string;
  id_proyecto?: number;
  nombre_proyecto?: string;
  estado_proyecto?: string;
  id_rol?: number;
  fecha_inicio_asignacion?: string;
  fecha_fin_asignacion?: string | null;
  porcentaje_dedicacion?: string;
}

interface ProjectData extends ProjectsAndRoles {
  getTeamMembers?: TeamMember[];
  managerInfo?: UserInfoBanca[];
}

export default function ProyectoActualPage() {
  const { user } = useAuth();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (!user?.email) return;

        if (!user.id_persona) {
          setError("Información de usuario incompleta.");
          setLoading(false);
          return;
        }

        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

        const response = await fetch(
          `${backendUrl}/projects/user-project-and-role`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id_empleado: user.id_persona }),
          }
        );

        if (response.status === 404) {
          setError(
            "La ruta de la API no está disponible. Verifica la configuración del servidor."
          );
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = (await response.json()) as ProjectData;

        if (!data.hasProject) {
          setError("No tienes ningún proyecto asignado actualmente.");
          setLoading(false);
          return;
        }

        setProjectData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError(
          "Error al cargar datos del proyecto. Por favor, intenta más tarde."
        );
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [user]);

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  const getUserRoleName = (): string => {
    if (!projectData?.userRole?.[0]?.titulo) return "No asignado";
    return projectData.userRole[0].titulo;
  };

  const getUserDedication = (): string => {
    if (!projectData?.userRole?.[0]?.porcentaje_dedicacion)
      return "No especificado";
    return `${projectData.userRole[0].porcentaje_dedicacion}%`;
  };

  const getProjectStatus = (): string => {
    if (!projectData?.userProject?.[0]) return "No disponible";

    const estado = projectData.userProject[0].estado;

    switch (estado) {
      case "en_progreso":
        return "En Progreso";
      case "completado":
        return "Completado";
      case "pausado":
        return "Pausado";
      case "cancelado":
        return "Cancelado";
      default:
        return estado || "No disponible";
    }
  };

  const getInitials = (name?: string): string => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getUserSkills = (): string => {
    if (!projectData?.userSkills || projectData.userSkills.length === 0) {
      return "Sin habilidades registradas";
    }

    return (
      projectData.userSkills
        .slice(0, 3)
        .map((skill) => `${skill.nombre} (${skill.nivel_minimo_requerido}/5)`)
        .join(", ") + (projectData.userSkills.length > 3 ? "..." : "")
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Cargando información del proyecto...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Mi Proyecto Actual
          </h1>
          <p className="text-muted-foreground">
            Detalles y progreso de tu proyecto asignado
          </p>
        </div>

        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-lg font-medium text-muted-foreground">{error}</p>
            <p className="mt-2">
              Contacta con tu supervisor si crees que esto es un error.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const projectInfo = projectData?.userProject?.[0];
  const projectStatus = getProjectStatus();
  const teamMembers = projectData?.getTeamMembers || [];
  const managerInfo = projectData?.managerInfo?.[0];
  const userSkills = getUserSkills();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Mi Proyecto Actual
        </h1>
        <p className="text-muted-foreground">
          Detalles y progreso de tu proyecto asignado
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                {projectInfo?.nombre || "Proyecto no disponible"}
              </CardTitle>
              <CardDescription className="mt-2">
                {projectInfo?.descripcion || "Sin descripción disponible"}
              </CardDescription>
            </div>
            <Badge className="bg-primary">{projectStatus}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Fecha Inicio</CardDescription>
                <CardTitle className="text-base">
                  {projectInfo ? formatDate(projectInfo.fecha_inicio) : "N/A"}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Fecha Fin</CardDescription>
                <CardTitle className="text-base">
                  {projectInfo
                    ? formatDate(projectInfo.fecha_fin_estimada)
                    : "N/A"}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Tu Rol</CardDescription>
                <CardTitle className="text-base">{getUserRoleName()}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Dedicación</CardDescription>
                <CardTitle className="text-base">
                  {getUserDedication()}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Equipo del Proyecto</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <Avatar>
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt={member.nombre_empleado}
                      />
                      <AvatarFallback>
                        {getInitials(member.nombre_empleado)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {member.nombre_empleado}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.titulo_rol || "No especificado"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center p-4 text-muted-foreground">
                  No hay miembros asignados al equipo
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Habilidades Requeridas</h3>
            <div className="rounded-lg border p-3">
              <p>{userSkills}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
