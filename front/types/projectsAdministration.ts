export interface Role {
  id_rol: number;
  titulo: string;
  nivel_experiencia_requerido: number;
  descripcion: string;
  assignments: Assignment[];
  skills: RoleSkill[];
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
  prioridad: number;
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
  descripcion: string;
}

export interface RoleSkill {
  id_habilidad: number;
  nombre: string;
  nivel_minimo_requerido: number;
  importancia: number;
}

export interface ProjectRole {
  id_rol: number;
  titulo: string;
  descripcion: string;
  nivel_experiencia_requerido: number;
  habilidades: RoleSkill[];
}

export interface ProjectFormData {
  id_proyecto: number;
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

export interface ProjectDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  project: TransformedProject | null;
  onProjectUpdated?: (updatedProject: TransformedProject) => void;
}
