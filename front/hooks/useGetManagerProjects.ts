import { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "@/lib/functions";
import {
  TransformedProject,
  Role,
  RolesByStatus,
} from "@/types/projectsAdministration";
import { apiUrl } from "@/constants";

export function useGetManagerProjects() {
  const [projects, setProjects] = useState<TransformedProject[]>([]);
  const [rolesByStatus, setRolesByStatus] = useState<RolesByStatus>(
    {} as RolesByStatus
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${apiUrl}/projects/manager-projects-with-roles`,
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

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    rolesByStatus,
    loading,
    error,
    refreshProjects: fetchProjects,
  };
}
