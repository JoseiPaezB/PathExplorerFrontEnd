export interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  estado: string;
  prioridad?: number;
  id_manager?: number;
  roles?: ProjectRole[];
}

export interface Skill {
  id_habilidad: number;
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  nivel_minimo_requerido: number;
  importancia: number;
}

export interface RoleAssignment {
  id_empleado: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  fecha_asignacion?: string;
  porcentaje_dedicacion?: number;
}

export interface ProjectRole {
  id_rol: number;
  titulo: string;
  descripcion: string;
  nivel_experiencia_requerido: number;
  estado?: string;
  id_proyecto?: number;
  id_manager?: number;
  skills?: Skill[];
  assignments?: RoleAssignment[];
}

export interface ProjectsResponse {
  success: boolean;
  hasProjects: boolean;
  message?: string;
  managerProjects?: Project[];
}

export interface NewProjectData {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  prioridad: number;
  id_manager: number;
  roles: {
    titulo: string;
    descripcion: string;
    nivel_experiencia_requerido: number;
    habilidades: {
      id_habilidad: number;
      nivel_minimo_requerido: number;
      importancia: number;
    }[];
  }[];
}
