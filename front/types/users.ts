export interface UserInfoBanca {
  id_persona: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_contratacion: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  password_hash: string;
  id_empleado: number;
  estado: string;
  porcentaje_disponibilidad: string;
  id_perfil: number;
  puesto_actual: string;
  antiguedad: number;
  historial_profesional: string;
}

export interface UpdateProfileData {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
}

export interface UserInfoBancaResponse {
  success: boolean;
  message: string;
  employees: UserInfoBanca;
}

export interface CoursesUser {
  id_curso: number;
  nombre: string;
  institucion: string;
  descripcion: string;
  duracion: number;
  modalidad: string;
  categoria: string;
  fecha_inicio: string;
  fecha_finalizacion: string;
  calificacion: number | null;
  certificado: boolean;
  fecha_creacion: string;
  progreso: string;
}

export interface CoursesUserResponse {
  success: boolean;
  courses: CoursesUser[];
}

export interface CertificationsUser {
  ID_Certificacion: number;
  Nombre: string;
  Institucion: string;
  Validez: number;
  Nivel: number;
  fecha_obtencion: string;
  fecha_vencimiento: string | null;
  estado_validacion: boolean;
  fecha_creacion: string;
}

export interface CertificationsUserResponse {
  success: boolean;
  certifications: CertificationsUser[];
}

type ProfessionalHistoryEntry = {
  nombre: string;
  apellido: string;
  historial: string;
  role: string;
};

export type ProfessionalHistory = {
  success: boolean;
  professionalHistory: ProfessionalHistoryEntry[];
};

export type CertificationItem = {
  id_certificacion: number;
  nombre: string;
  institucion: string;
  validez: number;
  nivel?: number;
};

export type CertificationsArray = CertificationItem[];

export interface RawCertification {
  ID_Certificacion: number;
  Nombre: string;
  Institucion: string;
  Validez: number | string;
  Nivel?: number | string;
}

export interface CertificationsResponse {
  success: boolean;
  certifications: RawCertification[];
}

export interface Skills {
  id_persona: number;
  id_habilidad: number;
  nivel_demostrado: number;
  fecha_adquisicion: string;
  evidencia: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  nivel_maximo: number;
}

export interface SkillsResponse {
  success: boolean;
  skills: Skills[];
}

export interface Trajectory {
  id_persona: number;
  id_trayectoria: number;
  fecha_inicio: string;
  progreso: string;
  etapa_actual: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre: string;
  descripcion: string;
  roles_secuenciales: string;
  tiempo_estimado: number;
}

export interface ProfessionalGoal {
  id_meta: number;
  id_persona: number;
  descripcion: string;
  plazo: "CORTO" | "MEDIO" | "LARGO";
  fecha_establecimiento: string;
  estado: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "CANCELADA";
  prioridad: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface UserTrajectoryResponse {
  success: boolean;
  trajectory: Trajectory[];
  professionalGoals: ProfessionalGoal[];
}
