export interface Role {
  id_rol: number;
  titulo: string;
  descripcion: string;
  assignments: Assignment[];
  habilidades?: {
    id_habilidad: number;
    nombre: string;
    nivel_minimo_requerido: number;
    importancia: number;
  }[];
  project?: any;
  skills?: any[];
  nivel_experiencia_requerido?: number;
}

export interface Assignment {
  nombre: string;
  apellido: string;
  fecha_asignacion?: string;
}

export interface TransformedProject {
  managerName: string;
  project: string;
  role: string;
  status: string;
  assignedTo: string | null;
  startDate: string;
  endDate: string;
  progress: number;
  id: number;
  allRoles: Role[];
  description: string;
}

export interface Skill {
  id_habilidad: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
}

export interface RoleSkill {
  id_habilidad: number;
  nivel_minimo_requerido: number;
  importancia: number;
}

export interface ProjectRole {
  titulo: string;
  descripcion: string;
  importancia: number;
  nivel_experiencia_requerido: number;
  habilidades: RoleSkill[];
}

export interface ProjectFormData {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  prioridad: number;
  roles: ProjectRole[];
}

export interface UserInfoBanca {
  id_empleado?: number;
  nombre?: string;
  apellido?: string;
  nombre_completo?: string;
  puesto_actual?: string;
  porcentaje_match?: string | number;
  porcentaje_disponibilidad?: string | number;
}

export interface RolesByStatus {
  pendientes: Role[];
  asignados: Role[];
  completados: Role[];
}

export interface EditableProject {
  id: number;
  id_proyecto: number;
  project: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: number;
  prioridad?: number;
  status: string;
  allRoles?: {
    titulo: string;
    descripcion: string;
    assignments?: { nombre: string; apellido: string }[];
    skills?: {
      id_habilidad: number;
      nombre: string;
      nivel_minimo_requerido: number;
      importancia: number;
    }[];
  }[];
}

export interface ProjectDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: number;
    project: string;
    startDate: string;
    endDate: string;
    status: string;
    description: string;
    allRoles: {
      titulo: string;
      descripcion: string;
      assignments?: { nombre: string; apellido: string }[];
      skills?: {
        id_habilidad: number;
        nombre: string;
        nivel_minimo_requerido: number;
        importancia: number;
      }[];
    }[];
  } | null;
  manager: { name: string } | null;
  onProjectUpdated?: (updatedProject: EditableProject) => void;
}
