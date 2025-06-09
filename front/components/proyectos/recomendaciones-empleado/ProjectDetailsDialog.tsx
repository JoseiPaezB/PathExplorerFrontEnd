import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, MapPin, Clock, Target } from "lucide-react";
import { RecommendedRole, Skill } from "@/types/recommendations";

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRole: RecommendedRole | null;
  onClose: () => void;
}

export function ProjectDetailsDialog({
  open,
  onOpenChange,
  selectedRole,
  onClose,
}: ProjectDetailsDialogProps) {
  if (!selectedRole) return null;

  const project = selectedRole.roleWithProject?.project?.[0];
  const manager = selectedRole.roleWithProject?.manager?.[0];
  const role = selectedRole.roleWithProject;

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EN_PROGRESO":
        return "bg-green-100 text-green-800 border-green-200";
      case "PLANIFICACION":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PAUSADO":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FINALIZADO":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Detalles del Proyecto y Rol
          </DialogTitle>
          <DialogDescription>
            Información completa sobre el proyecto y el rol seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Proyecto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                Información del Proyecto
              </h3>
              <Badge className={getStatusColor(project?.estado || "")}>
                {project?.estado?.replace("_", " ") || "Estado desconocido"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Nombre del Proyecto
                  </p>
                  <p className="text-sm">
                    {project?.nombre || "No especificado"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Fecha de Inicio
                    </p>
                    <p className="text-sm">
                      {formatDate(project?.fecha_inicio || "")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Fecha Estimada de Finalización
                    </p>
                    <p className="text-sm">
                      {formatDate(project?.fecha_fin_estimada || "")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Descripción del Proyecto
              </p>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {project?.descripcion || "No hay descripción disponible"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Información del Rol */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información del Rol</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Título del Rol
                </p>
                <p className="text-sm">{role?.titulo || "No especificado"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Nivel de Experiencia Requerido
                </p>
                <p className="text-sm">
                  {role?.nivel_experiencia_requerido
                    ? `Nivel ${role.nivel_experiencia_requerido}`
                    : "No especificado"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Descripción del Rol
              </p>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {role?.descripcion || "No hay descripción disponible"}
              </p>
            </div>
          </div>

          <Separator />

          {manager && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">
                    Manager del Proyecto
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Nombre Completo
                    </p>
                    <p className="text-sm">{`${manager.nombre} ${manager.apellido}`}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-sm">{manager.email}</p>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Habilidades Requeridas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Habilidades Requeridas</h3>

            {role?.skills && role.skills.length > 0 ? (
              <div className="space-y-3">
                {role.skills.map((skill: Skill, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{skill.nombre}</p>
                        <Badge variant="outline" className="text-xs">
                          {skill.categoria}
                        </Badge>
                      </div>
                      {skill.descripcion && (
                        <p className="text-xs text-gray-600 mt-1">
                          {skill.descripcion}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Nivel mínimo</p>
                      <p className="font-medium text-sm">
                        {skill.nivel_minimo_requerido}
                      </p>
                      <Badge
                        variant={
                          skill.importancia && parseInt(skill.importancia) > 3
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs mt-1"
                      >
                        Importancia: {skill.importancia}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                No hay habilidades específicas definidas para este rol
              </p>
            )}
          </div>

          {/* Compatibilidad */}
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Tu Compatibilidad</p>
                <p className="text-sm text-blue-700">
                  Basada en tus habilidades y experiencia actual
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {selectedRole.compatibilidad || 85}%
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
