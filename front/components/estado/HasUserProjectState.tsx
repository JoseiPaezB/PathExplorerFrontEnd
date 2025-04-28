import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Code, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColor } from "@/lib/functions";
import { ProjectsAndRoles } from "@/types/projectsAndRoles";
import { Role } from "@/types/projectsAndRoles";
import { Project } from "@/types/projects";

function HasUserProjectState({
  router,
  project,
  projects,
  role,
}: {
  router: any;
  project: Project;
  projects: ProjectsAndRoles;
  role: Role;
}) {
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

        {projects?.userSkills && projects.userSkills.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Code className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Habilidades Requeridas</h3>
            </div>

            <div className="flex flex-wrap gap-2 pl-7">
              {projects.userSkills.map((skill, index) => (
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

export default HasUserProjectState;
