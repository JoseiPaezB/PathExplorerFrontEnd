export interface Trayectory {
  id_trayectoria: number;
  id_persona: number;
  nombre: string;
  descripcion: string;
  roles_secuenciales: string;
  tiempo_estimado: number;
  progreso: string;
  etapa_actual: string;
}

export interface TrayectoryResponse {
  success: boolean;
  message: string;
  trayectoria: Trayectory;
}

export interface TrayectoryFormData {
  nombre: string;
  descripcion: string;
  roles_secuenciales: string[];
  tiempo_estimado: number;
}

export interface GeneratedTrayectoriesResponse {
  success: boolean;
  message: string;
  recommendations: Trayectory[];
}
