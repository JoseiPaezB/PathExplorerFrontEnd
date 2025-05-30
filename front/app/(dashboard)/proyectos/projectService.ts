import axios, { AxiosRequestConfig } from "axios";
import { apiUrl } from "@/constants";

const getAuthHeader = (): AxiosRequestConfig => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

interface UserProjectRole {
  projectId: string;
  role: string;
}

export const getUserProjectAndRole = async (
  id_empleado: string
): Promise<UserProjectRole> => {
  try {
    const response = await axios.post<UserProjectRole>(
      `${apiUrl}/projects/user-projects-with-roles`,
      { id_empleado },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user project and role:", error);
    throw error;
  }
};

interface ManagerProject {
  id: string;
  name: string;
  roles: string[];
  assignments: any[];
}

export const getManagerProjects = async (): Promise<ManagerProject[]> => {
  try {
    const response = await axios.get<ManagerProject[]>(
      `${apiUrl}/projects/manager-projects-with-roles`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manager projects:", error);
    throw error;
  }
};

interface CreateProjectData {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  prioridad: number;
  roles: {
    titulo: string;
    descripcion: string;
    importancia: number;
    nivel_experiencia_requerido: number;
    habilidades: {
      id_habilidad: number;
      nivel_minimo_requerido: number;
      importancia: number;
    }[];
  }[];
}

export const createProject = async (
  projectData: CreateProjectData
): Promise<any> => {
  try {
    const response = await axios.post(
      `${apiUrl}/projects/create-project`,
      projectData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const calculateProjectProgress = (
  startDate: string,
  endDate: string,
  status: string
): number => {
  if (status === "Completado") return 100;
  if (status === "Pendiente") return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  if (today < start) return 0;
  if (today > end) return 99;

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = today.getTime() - start.getTime();

  return Math.round((elapsed / totalDuration) * 100);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

interface Skill {
  id_habilidad: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
}

export const getAllSkills = async (): Promise<Skill[]> => {
  try {
    const response = await axios.get<{ success: boolean; skills: Skill[] }>(
      `${apiUrl}/projects/all-skills`,
      getAuthHeader()
    );

    if (response.data.success) {
      return response.data.skills;
    }
    return [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
};
export const editProject = async (projectData: any) => {
  try {
    const response = await axios.patch(
      `${apiUrl}/projects/edit-project`,
      projectData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error editing project:", error);
    throw error;
  }
};

export default {
  getUserProjectAndRole,
  getManagerProjects,
  createProject,
  calculateProjectProgress,
  formatDate,
  getAllSkills,
  editProject,
};
