export interface Skill {
  nivel_minimo_requerido: number;
  importancia: number;
  nombre: string;
  categoria: string;
  descripcion: string;
}

export interface Role {
  id_empleado: number;
  id_rol: number;
  id_proyecto: number;
  porcentaje_dedicacion: string;
  titulo: string;
  descripcion: string;
  nivel_experiencia_requerido: number;
}

export interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  estado: string;
}

export interface ProjectsAndRoles {
  hasProject: boolean;
  userProject: Project[];
  userRole: Role[];
  userSkills: Skill[];
}
