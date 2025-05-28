export interface Skill {
  id_habilidad: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  nivel_minimo_requerido: number;
  importancia: string;
}

export interface Manager {
  id_persona: number;
  nombre: string;
  apellido: string;
  email: string;
}

export interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  estado: string;
}

export interface Role {
  id_rol: number;
  titulo: string;
  descripcion: string;
  nivel_experiencia_requerido: string;
  id_proyecto: number;
  id_manager: number;
  skills?: Skill[];
  manager?: Manager[];
  project?: Project[];
}

export interface RecommendedRole {
  id_rol: number;
  titulo: string;
  descripcion: string;
  compatibilidad: number;
  roleWithProject: Role;
}

export interface Administrator {
  id_administrador: number;
  nombre_completo: string;
  departamento: string;
  nivel_acceso: number;
}

export interface SolicitudData {
  id_administrador: number;
  id_manager: number;
  id_empleado: number;
  id_rol: number;
  fecha_solicitud: string;
  justificacion: string;
  urgencia: number;
  estado: string;
  comentarios_resolucion: string;
  fecha_resolucion: null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}