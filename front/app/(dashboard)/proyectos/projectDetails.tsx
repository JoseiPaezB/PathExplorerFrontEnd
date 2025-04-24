import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, ClockIcon, InfoIcon, UserIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";




interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    project: string; // Added the missing 'project' property
    startDate: string;
    endDate: string;
    status: string;
    description: string;
    allRoles: {
      titulo: string;
      descripcion: string;
      assignments?: { nombre: string; apellido: string }[];
    }[];
  } | null;
  manager: { name: string } | null;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, onClose, project, manager }) => {
  if (!project) return null;

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Pendiente":
      case "PLANEACION":
        return "bg-yellow-50 text-yellow-700";
      case "En progreso":
      case "ACTIVO":
        return "bg-green-50 text-green-700";
      case "Completado":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };
  

  const getInitials = (name:string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-screen">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold">
            {project.project}
          </DialogTitle>
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
                    <AvatarFallback>{getInitials(manager?.name || "")}</AvatarFallback>
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

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon size={14} />
                  <span className="font-medium">Fecha inicio</span>
                </div>
                <div>{project.startDate}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon size={14} />
                  <span className="font-medium">Fecha fin</span>
                </div>
                <div>{project.endDate}</div>
              </div>
            </div>

            <div className="pt-2 pb-2">
              <h3 className="font-medium text-sm mb-1 text-gray-700">Descripción</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-gray-700">Roles del Proyecto</h3>
              
              {project.allRoles && project.allRoles.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {project.allRoles.map((role, index) => (
                    <Card key={index} className="shadow-sm border-gray-200">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-sm flex justify-between items-center">
                          <span>{role.titulo}</span>
                          {role.assignments && role.assignments.length > 0 ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs py-0">
                              Asignado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 text-xs py-0">
                              Sin asignar
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3 text-xs">
                        <p className="text-gray-700 mb-2">{role.descripcion}</p>
                        
                        {role.assignments && role.assignments.length > 0 ? (
                          <div className="space-y-1">
                            <h4 className="font-medium">Asignado a:</h4>
                            {role.assignments.map((person, i) => (
                              <div key={i} className="flex items-center gap-2 bg-gray-50 p-1 rounded-md">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src="/placeholder.svg" alt={`${person.nombre} ${person.apellido}`} />
                                  <AvatarFallback>
                                    {getInitials(`${person.nombre} ${person.apellido}`)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{person.nombre} {person.apellido}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 italic">
                            Este rol no tiene personas asignadas
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-2 text-sm">
                  No hay roles definidos para este proyecto
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-2">
          <Button onClick={onClose} size="sm">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;