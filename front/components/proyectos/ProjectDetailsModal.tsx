"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditProject } from "@/hooks/useEditProject";
import {
  ProjectDetailsProps,
  ProjectFormData,
  TransformedProject,
} from "@/types/projectsAdministration";
import { formatDateForApi, parsePriority } from "@/lib/functions";
import ProjectDetailsHeader from "@/components/proyectos/projectDetails/ProjectDetailsHeader";
import ProjectMetaInfo from "@/components/proyectos/projectDetails/ProjectMetaInfo";
import ProjectEditForm from "@/components/proyectos/projectDetails/ProjectEditForm";
import ProjectInfoCard from "@/components/proyectos/projectDetails/ProjectInfoCard";
import ProjectRolesCard from "@/components/proyectos/projectDetails/ProjectRolesCard";
import ProjectActionFooter from "@/components/proyectos/projectDetails/ProjectActionFooter";

const ProjectDetailsModal: React.FC<ProjectDetailsProps> = ({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
}: ProjectDetailsProps) => {
  const [editedProject, setEditedProject] = useState<TransformedProject | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const { editProject } = useEditProject();

  useEffect(() => {
    if (project) {
      setEditedProject({ ...project });
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

    setEditedProject((prev: TransformedProject | null) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleRoleChange = (
    roleIndex: number,
    field: string,
    value: string | number
  ) => {
    setEditedProject((prev: TransformedProject | null) => {
      if (!prev || !prev.allRoles) return prev;

      const updatedRoles = [...prev.allRoles];
      updatedRoles[roleIndex] = {
        ...updatedRoles[roleIndex],
        [field]: value,
      };

      return {
        ...prev,
        allRoles: updatedRoles,
      };
    });
  };

  const handleSkillChange = (
    roleIndex: number,
    skillIndex: number,
    field: string,
    value: string | number
  ) => {
    setEditedProject((prev: TransformedProject | null) => {
      if (!prev || !prev.allRoles) return prev;

      const updatedRoles = [...prev.allRoles];
      const updatedSkills = [...updatedRoles[roleIndex].skills];

      updatedSkills[skillIndex] = {
        ...updatedSkills[skillIndex],
        [field]: value,
      };

      updatedRoles[roleIndex] = {
        ...updatedRoles[roleIndex],
        skills: updatedSkills,
      };

      return {
        ...prev,
        allRoles: updatedRoles,
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedProject) return;

    try {
      const formattedData: ProjectFormData = {
        id_proyecto: editedProject.id,
        nombre: editedProject.project,
        descripcion: editedProject.description,
        fecha_inicio: formatDateForApi(editedProject.startDate),
        fecha_fin_estimada: formatDateForApi(editedProject.endDate),
        prioridad: parsePriority(editedProject.prioridad),
        roles: editedProject.allRoles.map((role) => ({
          id_rol: role.id_rol,
          titulo: role.titulo,
          descripcion: role.descripcion,
          nivel_experiencia_requerido: role.nivel_experiencia_requerido,
          habilidades: role.skills.map((skill) => ({
            id_habilidad: skill.id_habilidad,
            nombre: skill.nombre,
            nivel_minimo_requerido: skill.nivel_minimo_requerido,
            importancia: skill.importancia,
          })),
        })),
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
              managerName={project.managerName}
              status={project.status}
            />

            {isEditMode ? (
              <ProjectEditForm
                editedProject={editedProject}
                handleChange={handleChange}
                handleRoleChange={handleRoleChange}
                handleSkillChange={handleSkillChange}
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
