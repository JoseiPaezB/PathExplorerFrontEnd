"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { formatDate } from "@/lib/functions";
import { getEmpleadosBanca } from "@/app/(dashboard)/usuarios/actions";
import { getBestCandidatesForRole } from "./actions";
import ProjectDetailsModal from "./projectDetails";
import PageHeader from "./components/PageHeader";
import SearchBar from "./components/SearchBar";
import DropdownFilter from "./components/DropdownFilter";
import PendingRoles from "./components/PendingRoles";
import AssignedRoles from "./components/AssignedRoles";
import FinishedRoles from "./components/FinishedRoles";
import ProjectsList from "./components/ProjectsList";
import AssignEmployeeDialog from "./components/AssignEmployeeDialog";
import ConfirmationDialog from "./components/ConfirmationDialog";
import NewProjectForm from "./components/NewProjectForm";
import {
  UserInfoBanca,
  TransformedProject,
  Role,
  RolesByStatus,
} from "./types/projects";

export default function ProyectosPage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<TransformedProject | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [projects, setProjects] = useState<TransformedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("Todos");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [currentRoleId, setCurrentRoleId] = useState<number | undefined>(
    undefined
  );
  const [empleadosBanca, setEmpleadosBanca] = useState<UserInfoBanca[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidateSearchTerm, setCandidateSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<UserInfoBanca | null>(null);
  const [rolesByStatus, setRolesByStatus] = useState<RolesByStatus>(
    {} as RolesByStatus
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:4000/api/projects/manager-projects-with-roles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
        const managerName =
          userInfo.nombre && userInfo.apellido
            ? `${userInfo.nombre} ${userInfo.apellido}`
            : "Gerente Actual";

        if (response.data.success && response.data.hasProjects) {
          const transformedProjects = response.data.managerProjects.map(
            (project: any) => {
              let progress = 0;
              if (
                project.estado === "Completado" ||
                project.estado === "FINALIZADO"
              ) {
                progress = 100;
              } else if (
                project.estado === "En progreso" ||
                project.estado === "ACTIVO"
              ) {
                const startDate = new Date(project.fecha_inicio);
                const endDate = new Date(project.fecha_fin_estimada);
                const today = new Date();

                const totalDuration = endDate.getTime() - startDate.getTime();
                const elapsed = today.getTime() - startDate.getTime();

                progress = Math.min(
                  Math.round((elapsed / totalDuration) * 100),
                  99
                );
              }

              const assignedPersons = project.roles.flatMap((role: Role) =>
                role.assignments.map((assignment) => ({
                  roleTitulo: role.titulo,
                  roleId: role.id_rol,
                  ...assignment,
                }))
              );

              return {
                managerName: managerName,
                project: project.nombre,
                role:
                  project.roles.length > 0
                    ? project.roles[0].titulo
                    : "Multiple Roles",
                status: project.estado || "Pendiente",
                assignedTo:
                  assignedPersons.length > 0
                    ? `${assignedPersons[0].nombre} ${assignedPersons[0].apellido}`
                    : null,
                startDate: formatDate(project.fecha_inicio),
                endDate: formatDate(project.fecha_fin_estimada),
                progress: progress,
                id: project.id_proyecto,
                allRoles: project.roles,
                description: project.descripcion,
              };
            }
          );

          setProjects(transformedProjects);

          const tempRoles = {
            pendientes: [] as Role[],
            asignados: [] as Role[],
            completados: [] as Role[],
          };

          response.data.managerProjects.forEach((project: any) => {
            project.roles.forEach((role: Role) => {
              const roleWithProject = {
                ...role,
                project: {
                  nombre: project.nombre,
                  fecha_inicio: project.fecha_inicio,
                  fecha_fin_estimada: project.fecha_fin_estimada,
                  estado: project.estado,
                  id_proyecto: project.id_proyecto,
                  descripcion: project.descripcion,
                },
              };

              if (role.assignments && role.assignments.length > 0) {
                if (
                  project.estado === "Completado" ||
                  project.estado === "FINALIZADO"
                ) {
                  tempRoles.completados.push(roleWithProject);
                } else {
                  tempRoles.asignados.push(roleWithProject);
                }
              } else {
                tempRoles.pendientes.push(roleWithProject);
              }
            });
          });

          setRolesByStatus(tempRoles);
        } else {
          setProjects([]);
          setRolesByStatus({} as RolesByStatus);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          "No se pudieron cargar los proyectos. Por favor, intente de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
    setLoadingCandidates(true);
    setShowAssignDialog(true);
    setCandidateSearchTerm("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (!roleId) {
        throw new Error("Role ID is required");
      }
      const response = await getBestCandidatesForRole(roleId, token);

      if (response.success && response.candidates) {
        setEmpleadosBanca(response.candidates);
      } else {
        console.error("Error fetching candidates:", response.message);
        const backupResponse = await getEmpleadosBanca(token);
        if (backupResponse.success && backupResponse.employees) {
          const employeesArray = Array.isArray(backupResponse.employees)
            ? backupResponse.employees
            : [backupResponse.employees];

          setEmpleadosBanca(employeesArray);
        }
      }
    } catch (error) {
      console.error("Error getting candidates:", error);
      setEmpleadosBanca([]);
    } finally {
      setLoadingCandidates(false);
    }
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <PendingRoles
              rolesByStatus={rolesByStatus}
              determineUrgency={determineUrgency}
              handleAssignClick={handleAssignClick}
            />
            <AssignedRoles rolesByStatus={rolesByStatus} />
            <FinishedRoles rolesByStatus={rolesByStatus} />
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
          project={selectedProject}
          manager={{
            name: selectedProject.managerName || "Gerente del Proyecto",
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
      />
    </div>
  );
}
