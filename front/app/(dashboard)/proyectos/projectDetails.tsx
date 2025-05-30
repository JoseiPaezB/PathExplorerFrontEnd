import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, InfoIcon, UserIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { editProject } from "./projectService";
import {
  formatDateForApi,
  parsePriority,
  getBadgeImportance,
  getBadgeColor,
  getInitials,
} from "@/lib/functions";

interface EditableProject {
  id: number;
  id_proyecto: number;
  project: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: number;
  prioridad?: number;
  status: string;
  allRoles?: {
    titulo: string;
    descripcion: string;
    assignments?: { nombre: string; apellido: string }[];
    skills?: {
      id_habilidad: number;
      nombre: string;
      nivel_minimo_requerido: number;
      importancia: number;
    }[];
  }[];
}

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    project: string;
    startDate: string;
    endDate: string;
    status: string;
    description: string;
    allRoles: {
      titulo: string;
      descripcion: string;
      assignments?: { nombre: string; apellido: string }[];
      skills?: {
        id_habilidad: number;
        nombre: string;
        nivel_minimo_requerido: number;
        importancia: number;
      }[];
    }[];
  } | null;
  manager: { name: string } | null;
  onProjectUpdated?: (updatedProject: EditableProject) => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project,
  manager,
}) => {
  const [editedProject, setEditedProject] = useState<EditableProject | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (project) {
      setEditedProject({ ...project } as EditableProject);
      setIsEditMode(false);
    }
  }, [project]);

  if (!project) return null;

  if (!project) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setEditedProject((prev: EditableProject | null) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        [name]: value,
      };
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formattedData = {
        id_proyecto: editedProject?.id,
        nombre: editedProject?.project,
        descripcion: editedProject?.description,
        fecha_inicio: formatDateForApi(editedProject?.startDate ?? ""),
        fecha_fin_estimada: formatDateForApi(editedProject?.endDate ?? ""),
        prioridad: parsePriority(editedProject?.priority),
        estado: editedProject?.status || "ACTIVO",
      };

      const result = await editProject(formattedData);

      if (result.success) {
        setIsEditMode(false);
        onClose();
        alert("Proyecto actualizado exitosamente");
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      alert("Error al guardar el proyecto. Por favor intente de nuevo.");
    } finally {
    }
  };

  const toggleEditMode = () => {
    const newMode = !isEditMode;
    setIsEditMode(newMode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-screen">
        <DialogHeader className="pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">
              {isEditMode ? "Editar Proyecto" : "Detalles del Proyecto"}
            </DialogTitle>
            {!isEditMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleEditMode}
                className="h-8 w-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
                <span className="sr-only">Edit</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <UserIcon size={14} />
                  <span className="font-medium">Gerente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" alt={manager?.name} />
                    <AvatarFallback>{manager?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span>{manager?.name || "No asignado"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <InfoIcon size={14} />
                  <span className="font-medium">Estado</span>
                </div>
                <Badge
                  variant="outline"
                  className={getBadgeColor(project.status)}
                >
                  {project.status}
                </Badge>
              </div>
            </div>

            {isEditMode ? (
              <div className="space-y-4 pt-4">
                <div className="space-y-1">
                  <label
                    className="block text-sm text-gray-600"
                    htmlFor="projectName"
                  >
                    Nombre del Proyecto
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="project"
                    value={editedProject?.project || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    className="block text-sm text-gray-600"
                    htmlFor="description"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={editedProject?.description || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label
                      className="block text-sm text-gray-600"
                      htmlFor="startDate"
                    >
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={editedProject?.startDate || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className="block text-sm text-gray-600"
                      htmlFor="endDate"
                    >
                      Fecha Fin Estimada
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={editedProject?.endDate || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className="block text-sm text-gray-600"
                    htmlFor="priority"
                  >
                    Prioridad
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={editedProject?.priority || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="1">Baja</option>
                    <option value="3">Media</option>
                    <option value="5">Alta</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.project}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">
                        Descripción
                      </h4>
                      <p className="text-sm">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">
                          Fecha Inicio
                        </h4>
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} />
                          <span className="text-sm">{project.startDate}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">
                          Fecha Fin
                        </h4>
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} />
                          <span className="text-sm">{project.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {project.allRoles && project.allRoles.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Roles en el Proyecto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.allRoles.map((role, index) => (
                        <div
                          key={index}
                          className="border-b pb-3 last:border-0 last:pb-0"
                        >
                          <h4 className="font-medium">{role.titulo}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {role.descripcion}
                          </p>

                          {role.skills && role.skills.length > 0 && (
                            <div className="mt-2">
                              <h5 className="text-xs font-medium text-gray-500 mb-1">
                                Habilidades requeridas
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {role.skills.map((skill, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className={getBadgeImportance(
                                      skill.importancia
                                    )}
                                  >
                                    {skill.nombre}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {role.assignments && role.assignments.length > 0 && (
                            <div className="mt-2">
                              <h5 className="text-xs font-medium text-gray-500 mb-1">
                                Asignados
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {role.assignments.map((person, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1 text-xs"
                                  >
                                    <Avatar className="h-5 w-5">
                                      <AvatarFallback>
                                        {getInitials(
                                          `${person.nombre} ${person.apellido}`
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>
                                      {person.nombre} {person.apellido}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-2">
          {isEditMode ? (
            <>
              <Button onClick={handleSave} size="sm">
                Guardar Cambios
              </Button>
              <Button
                onClick={() => setIsEditMode(false)}
                size="sm"
                variant="outline"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={onClose} size="sm">
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
