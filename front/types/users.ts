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
  fecha_inicio: string;
  fecha_finalizacion: string;
  calificacion: number | null;
  certificado: boolean;
  fecha_creacion: string;
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
  achievements: string;
};

export type ProfessionalHistory = ProfessionalHistoryEntry[];

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
