"use client";
import { useState, useEffect, use } from "react";
import { params } from "@/types/parameters";
import { ProjectAndRoles } from "@/types/projectAndRoles";
import { getUserProjectAndRole } from "./actions";
import { Calendar, BookOpen, Code, Users, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColor } from "@/lib/functions";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function UserStatePage({ params }: { params: params }) {
  const unwrappedParams: params = use(params);
  const employeeId = unwrappedParams.id;
  const router = useRouter();
  const [userProjectAndRole, setUserProjectAndRole] =
    useState<ProjectAndRoles>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(userProjectAndRole);

  useEffect(() => {
    const fetchUserProjectState = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const userProjectData = await getUserProjectAndRole(employeeId, token);
        setUserProjectAndRole(userProjectData);
        setLoading(false);
      } catch (error) {
        setError("Error cargando el estado del usuario");
        setLoading(false);
      }
    };

    fetchUserProjectState();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
        <span>Error: {error}</span>
      </div>
    );
  }

  if (
    !userProjectAndRole?.userProject ||
    userProjectAndRole.userProject.length === 0
  ) {
    return (
      <Card className="border-none shadow-md">
        <div className="flex items-center gap-2 pt-4 pb-2 px-4">
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
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Información del rol del empleado
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center py-8">
          <p className="text-lg text-gray-600">
            Este empleado no está asignado a ningún proyecto actualmente.
          </p>
        </CardContent>
      </Card>
    );
  }

  const project = userProjectAndRole?.userProject[0];
  const role = userProjectAndRole?.userRole?.[0];

  return (
    <Card className="border-none shadow-md">
      <div className="flex items-center gap-2 pt-4 pb-2 px-4">
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
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Información del Proyecto y Rol
            </CardTitle>
            <CardDescription>
              Visualiza el rol del empleado en el proyecto y su estado actual.
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(project.estado)} px-3 py-1`}>
            {project.estado}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{project.nombre}</h3>
            <p className="text-gray-600 mt-1">{project.descripcion}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Fecha de inicio</p>
                <p className="font-medium">
                  {formatDate(project.fecha_inicio)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Fecha estimada de finalización
                </p>
                <p className="font-medium">
                  {formatDate(project.fecha_fin_estimada)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {role && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Rol en el Proyecto</h3>
            </div>

            <div className="pl-7">
              <p className="font-medium text-lg">{role.titulo}</p>
              {role.descripcion && (
                <p className="text-gray-600 mt-1">{role.descripcion}</p>
              )}
            </div>
          </div>
        )}

        {userProjectAndRole?.userSkills &&
          userProjectAndRole.userSkills.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Habilidades Requeridas</h3>
              </div>

              <div className="flex flex-wrap gap-2 pl-7">
                {userProjectAndRole.userSkills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
