import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add interceptor to inject the token in each request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Define types based on the API response structure
interface Skill {
  id_persona?: number;
  id_habilidad: number;
  nivel_demostrado: number;
  fecha_adquisicion: string;
  evidencia: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre: string;
  categoria: 'TECNICA' | 'BLANDA';
  descripcion: string;
  nivel_maximo: number;
}

interface Course {
  id_curso: number;
  nombre: string;
  institucion: string;
  descripcion: string;
  duracion: number;
  modalidad: 'VIRTUAL' | 'PRESENCIAL';
  categoria: string;
  fecha_inicio: string;
  fecha_finalizacion: string | null;
  calificacion: string | null;
  certificado: boolean;
  fecha_creacion: string | null;
  progreso: string;
}

interface Certification {
  id_certificacion: number;
  nombre: string;
  institucion: string;
  validez: number;
  nivel: number;
  fecha_obtencion: string;
  fecha_vencimiento: string;
  estado_validacion: boolean;
  fecha_creacion: string;
}

interface EmployeeProject {
  // Define based on your API response
  id_proyecto?: number;
  nombre?: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  fecha_fin_real?: string | null;
  estado?: string;
  prioridad?: number;
  // Add other fields as needed
}

interface TeamMember {
  // Define based on your API response
  id_persona?: number;
  nombre?: string;
  apellido?: string;
  // Add other fields as needed
}

interface RoleSkill {
  nivel_minimo_requerido: number;
  importancia: number;
  nombre: string;
  categoria: 'TECNICA' | 'BLANDA';
  descripcion: string;
}

interface ProjectRole {
  id_rol: number;
  titulo: string;
  descripcion: string;
  nivel_experiencia_requerido: number;
  skills: RoleSkill[];
}

interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  fecha_fin_real: string | null;
  estado: 'ACTIVO' | 'FINALIZADO' | 'PLANEACION';
  prioridad: number;
  id_manager: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  roles: (ProjectRole | null)[];
}

// Employee dashboard data structure
interface EmployeeDashboardData {
  teamMembers: TeamMember[];
  courses: Course[];
  certifications: Certification[];
  skills: Skill[];
  employeeProyect: EmployeeProject[];
}

// Manager dashboard data structure
interface ManagerDashboardData {
  rolesWithoutAssignments: Project[];
  courses: Course[];
  certifications: Certification[];
  skills: Skill[];
}

// Union type for dashboard data
type DashboardData = EmployeeDashboardData | ManagerDashboardData;

// Type guard functions to check which type of dashboard data we have
function isManagerData(data: DashboardData): data is ManagerDashboardData {
  return 'rolesWithoutAssignments' in data;
}

function isEmployeeData(data: DashboardData): data is EmployeeDashboardData {
  return 'teamMembers' in data;
}

interface UseDashboardDataReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  isManager: boolean | null;
  refreshData: () => void;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isManager, setIsManager] = useState<boolean | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching dashboard data...');
      const token = localStorage.getItem('token');
      
      // Use Next.js App Router API route
      const response = await axios.get('/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = response.data;
      console.log('Dashboard data received:', responseData);
      setData(responseData);
      
      // Determine user role based on the response structure
      // If 'rolesWithoutAssignments' exists in the response, user is a manager
      const userIsManager = 'rolesWithoutAssignments' in responseData;
      console.log('User determined to be a manager:', userIsManager);
      setIsManager(userIsManager);

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || `Error al obtener los datos del dashboard: ${err.message}`;
        console.error('Axios error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message
        });
        setError(errorMessage);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener los datos';
        setError(errorMessage);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to manually refresh the data when needed
  const refreshData = () => {
    fetchDashboardData();
  };

  // Helper functions to safely access data based on user role
  const getManagerData = (): ManagerDashboardData | null => {
    if (data && isManagerData(data)) {
      return data;
    }
    return null;
  };

  const getEmployeeData = (): EmployeeDashboardData | null => {
    if (data && isEmployeeData(data)) {
      return data;
    }
    return null;
  };

  return {
    data,
    isLoading,
    error,
    isManager,
    refreshData,
  };
}

// Additional utility functions to safely access specific data
export const useManagerDashboard = (): {
  rolesWithoutAssignments: Project[];
  courses: Course[];
  certifications: Certification[];
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => void;
} => {
  const { data, isLoading, error, refreshData } = useDashboardData();
  
  const emptyManagerData = { 
    rolesWithoutAssignments: [], 
    courses: [], 
    certifications: [], 
    skills: [] 
  };
  
  // Only return actual data if we have data AND it's the manager structure
  const managerData = data && 'rolesWithoutAssignments' in data 
    ? data 
    : emptyManagerData;
  
  return {
    ...managerData,
    isLoading,
    error,
    refreshData,
  };
};

export const useEmployeeDashboard = (): {
  teamMembers: TeamMember[];
  courses: Course[];
  certifications: Certification[];
  skills: Skill[];
  employeeProyect: EmployeeProject[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => void;
} => {
  const { data, isLoading, error, refreshData } = useDashboardData();
  
  const emptyEmployeeData = { 
    teamMembers: [], 
    courses: [], 
    certifications: [], 
    skills: [], 
    employeeProyect: [] 
  };
  
  // Only return actual data if we have data AND it's the employee structure
  const employeeData = data && 'teamMembers' in data 
    ? data 
    : emptyEmployeeData;
  
  return {
    ...employeeData,
    isLoading,
    error,
    refreshData,
  };
};

export default useDashboardData;