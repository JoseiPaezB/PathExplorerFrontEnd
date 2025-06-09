export interface UpdateProfileData {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  genero?: string;
  nacionalidad?: string;
  puesto_actual?: string;
}

export type UserRole = "administrador" | "manager" | "empleado";

export interface UserProfile {
  id_perfil: number;
  id_persona: number;
  puesto_actual: string;
  antiguedad: number;
  historial_profesional: string;
  ultima_actualizacion: string;
}

export interface RoleData {
  id_administrador?: number;
  id_manager?: number;
  id_empleado?: number;
  id_persona: number;
  nivel_acceso?: number;
  departamento?: string;
  area_responsabilidad?: string;
  nivel_autorizacion?: number;
  estado?: string;
  porcentaje_disponibilidad?: number;
}

export interface User {
  id_persona: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  genero?: string;
  nacionalidad?: string;
  fecha_contratacion: string;
  role: UserRole;
  roleData: RoleData;
  profile: UserProfile;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface JwtPayload {
  id_persona: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}