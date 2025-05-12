"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetManagerProjects } from "@/hooks/useGetManagerProjects";
import { useGetBestCandidates } from "@/hooks/fetchGetBestCandidatesForRole";
import { fetchGetAllAdministradores } from "@/hooks/fetchGetAllAdministradores";
import { useCreateSolicitud } from "@/hooks/useCreateSolicitud";
import ProjectDetailsModal from "@/components/proyectos/ProjectDetailsModal";
import PageHeader from "@/components/proyectos/PageHeader";
import NewProjectForm from "@/components/proyectos/NewProjectForm";
import SearchBar from "@/components/proyectos/SearchBar";
import DropdownFilter from "@/components/proyectos/DropdownFilter";
import ProjectsList from "@/components/proyectos/ProjectsList";
import PendingRoles from "@/components/proyectos/PendingRoles";
import AssignedRoles from "@/components/proyectos/AssignedRoles";
import AssignEmployeeDialog from "@/components/proyectos/AssignEmployeeDialog";
import ConfirmationDialog from "@/components/proyectos/ConfirmationDialog";

import {
  UserInfoBanca,
  TransformedProject,
  Role,
} from "@/types/projectsAdministration";

export default function ProyectosPage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<TransformedProject | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("Todos");

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [currentRoleId, setCurrentRoleId] = useState<number | undefined>(
    undefined
  );
  const [candidateSearchTerm, setCandidateSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<UserInfoBanca | null>(null);

  const { projects, rolesByStatus, loading, error, refreshProjects } =
    useGetManagerProjects();
  console.log(rolesByStatus);

  const {
    candidates: empleadosBanca,
    isLoading: loadingCandidates,
    error: candidatesError,
    fetchCandidatesForRole,
  } = useGetBestCandidates();
  const { createSolicitud } = useCreateSolicitud();
  const { administrador } = fetchGetAllAdministradores();

  const determineUrgency = (role: Role) => {
    const hasHighImportanceSkill = role.habilidades?.some(
      (skill) => skill.importancia > 3
    );

    if (hasHighImportanceSkill) {
      return "Urgente";
    } else if (
      role.nivel_experiencia_requerido &&
      role.nivel_experiencia_requerido > 2
    ) {
      return "Normal";
    } else {
      return "Baja";
    }
  };

  const handleAssignClick = async (
    project: string,
    role: string,
    roleId?: number
  ) => {
    setCurrentProject(project);
    setCurrentRole(role);
    setCurrentRoleId(roleId);
    setShowAssignDialog(true);
    setCandidateSearchTerm("");

    await fetchCandidatesForRole(roleId);
  };

  const closeAssignDialog = () => {
    setShowAssignDialog(false);
    setCurrentProject("");
    setCurrentRole("");
    setCurrentRoleId(undefined);
    setCandidateSearchTerm("");
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch = project.project
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchEstado =
        selectedEstado === "Todos" || project.status === selectedEstado;
      return matchSearch && matchEstado;
    });
  }, [projects, searchTerm, selectedEstado]);

  if (loading)
    return <div className="p-4 text-center">Cargando proyectos...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <PageHeader setShowNewProjectDialog={setShowNewProjectDialog} />

      <div className="flex items-center gap-2">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <DropdownFilter setSelectedEstado={setSelectedEstado} />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="kanban">Vista Kanban</TabsTrigger>
          <TabsTrigger value="lista">Vista Proyectos</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <PendingRoles
              rolesByStatus={rolesByStatus}
              determineUrgency={determineUrgency}
              handleAssignClick={handleAssignClick}
            />
            <AssignedRoles rolesByStatus={rolesByStatus} />
          </div>
        </TabsContent>

        <TabsContent value="lista" className="space-y-4">
          <ProjectsList
            projects={projects}
            filteredProjects={filteredProjects}
            setSelectedProject={setSelectedProject}
            setIsDetailsModalOpen={setIsDetailsModalOpen}
          />
        </TabsContent>
      </Tabs>

      {selectedProject && (
        <ProjectDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          project={{
            id: selectedProject.id,
            project: selectedProject.project,
            startDate: selectedProject.startDate,
            endDate: selectedProject.endDate,
            status: selectedProject.status,
            description: selectedProject.description,
            allRoles: selectedProject.allRoles,
          }}
          manager={{
            name: selectedProject.managerName || "Gerente del Proyecto",
          }}
          onProjectUpdated={() => {
            refreshProjects();
          }}
        />
      )}

      <Dialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <NewProjectForm
              onSuccess={() => {
                setShowNewProjectDialog(false);
                refreshProjects();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AssignEmployeeDialog
        showAssignDialog={showAssignDialog}
        closeAssignDialog={closeAssignDialog}
        currentProject={currentProject}
        currentRole={currentRole}
        loadingCandidates={loadingCandidates}
        empleadosBanca={empleadosBanca}
        candidateSearchTerm={candidateSearchTerm}
        setCandidateSearchTerm={setCandidateSearchTerm}
        setSelectedEmployee={setSelectedEmployee}
        setShowConfirmDialog={setShowConfirmDialog}
      />

      <ConfirmationDialog
        showConfirmDialog={showConfirmDialog}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        currentRole={currentRole}
        currentProject={currentProject}
        currentRoleId={currentRoleId}
        closeAssignDialog={closeAssignDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        onSuccess={() => refreshProjects()}
        createSolicitud={createSolicitud}
        administrators={administrador}
      />
    </div>
  );
}
