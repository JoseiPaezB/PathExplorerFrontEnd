import axios, { AxiosRequestConfig } from 'axios';

interface AuthHeader {
  headers: {
    Authorization: string;
  };
}

// Get the JWT token from localStorage
const getAuthHeader = (): AxiosRequestConfig => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// User project and role response type (adjust fields based on API)
interface UserProjectRole {
  projectId: string;
  role: string;
  // Agrega otros campos según la respuesta real
}

// Fetch a user's project and role
export const getUserProjectAndRole = async (id_empleado: string): Promise<UserProjectRole> => {
  try {
    const response = await axios.post<UserProjectRole>(
      'http://localhost:4000/api/projects/user-projects-with-roles', 
      { id_empleado },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user project and role:', error);
    throw error;
  }
};

// Manager projects response type (adjust fields based on API)
interface ManagerProject {
  id: string;
  name: string;
  roles: string[];
  assignments: any[]; // Ajusta según el contenido
}

// Fetch projects for a manager with roles and assignments
export const getManagerProjects = async (): Promise<ManagerProject[]> => {
  try {
    const response = await axios.get<ManagerProject[]>(
      'http://localhost:4000/api/projects/manager-projects-with-roles',
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching manager projects:', error);
    throw error;
  }
};

// Project creation input and response types (customize based on your data model)
interface CreateProjectData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  // Otros campos según tu backend
}

interface CreatedProjectResponse {
  id: string;
  name: string;
  // Otros campos según respuesta
}

// Create a new project
export const createProject = async (projectData: CreateProjectData): Promise<CreatedProjectResponse> => {
  try {
    const response = await axios.post<CreatedProjectResponse>(
      '/api/projects/create-project',
      projectData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Function to calculate project progress based on start and end dates
export const calculateProjectProgress = (startDate: string, endDate: string, status: string): number => {
  if (status === 'Completado') return 100;
  if (status === 'Pendiente') return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  if (today < start) return 0;
  if (today > end) return 99; // Not 100% unless marked as completed

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = today.getTime() - start.getTime();

  return Math.round((elapsed / totalDuration) * 100);
};

// Format date to local format
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default {
  getUserProjectAndRole,
  getManagerProjects,
  createProject,
  calculateProjectProgress,
  formatDate
};
