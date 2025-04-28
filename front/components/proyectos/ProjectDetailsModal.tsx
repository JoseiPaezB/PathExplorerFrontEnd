"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditProject } from "@/hooks/useEditProject";
import { useProjectUtils } from "@/hooks/useProjectUtils";
import {
  EditableProject,
  ProjectDetailsProps,
} from "@/types/projectsAdministration";

import ProjectDetailsHeader from "@/components/proyectos/projectDetails/ProjectDetailsHeader";
import ProjectMetaInfo from "@/components/proyectos/projectDetails/ProjectMetaInfo";
import ProjectEditForm from "@/components/proyectos/projectDetails/ProjectEditForm";
import ProjectInfoCard from "@/components/proyectos/projectDetails/ProjectInfoCard";
import ProjectRolesCard from "@/components/proyectos/projectDetails/ProjectRolesCard";
import ProjectActionFooter from "@/components/proyectos/projectDetails/ProjectActionFooter";

interface EditProjectData {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string | null;
  fecha_fin_estimada: string | null;
  prioridad: number;
  estado: string;
}

const ProjectDetailsModal: React.FC<ProjectDetailsProps> = ({
  isOpen,
  onClose,
  project,
  manager,
  onProjectUpdated,
}: ProjectDetailsProps) => {
  const [editedProject, setEditedProject] = useState<EditableProject | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const { editProject } = useEditProject();
  const { formatDateForApi, parsePriority } = useProjectUtils();

  useEffect(() => {
    if (project) {
      setEditedProject({ ...project } as EditableProject);
      setIsEditMode(false);
    }
  }, [project]);

  if (!project) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setEditedProject((prev: EditableProject | null) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formattedData: EditProjectData = {
        id_proyecto: editedProject?.id ?? 0,
        nombre: editedProject?.project || "",
        descripcion: editedProject?.description || "",
        fecha_inicio: formatDateForApi(editedProject?.startDate ?? ""),
        fecha_fin_estimada: formatDateForApi(editedProject?.endDate ?? ""),
        prioridad: parsePriority(editedProject?.priority),
        estado: editedProject?.status || "ACTIVO",
      };

      const result = await editProject(formattedData);

      if (result.success) {
        setIsEditMode(false);
        onClose();

        if (onProjectUpdated && editedProject) {
          onProjectUpdated(editedProject);
        }

        alert("Proyecto actualizado exitosamente");
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      alert("Error al guardar el proyecto. Por favor intente de nuevo.");
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-screen">
        <ProjectDetailsHeader
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
        />

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <ProjectMetaInfo
              managerName={manager?.name}
              status={project.status}
            />

            {isEditMode ? (
              <ProjectEditForm
                editedProject={editedProject}
                handleChange={handleChange}
              />
            ) : (
              <div className="space-y-4 pt-4">
                <ProjectInfoCard
                  title={project.project}
                  description={project.description}
                  startDate={project.startDate}
                  endDate={project.endDate}
                />

                {project.allRoles && project.allRoles.length > 0 && (
                  <ProjectRolesCard roles={project.allRoles} />
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <ProjectActionFooter
          isEditMode={isEditMode}
          onSave={handleSave}
          onCancel={() => setIsEditMode(false)}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
