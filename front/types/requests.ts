export interface RequestResponse {
  hasRequests: boolean;
  requests: Request[];
}

export interface Request {
  id_solicitud: number;
  id_manager: number;
  id_administrador: number;
  id_empleado: number;
  id_rol: number;
  fecha_solicitud: string;
  justificacion: string;
  urgencia: number;
  estado: string;
  comentarios_resolucion: string;
  fecha_resolucion: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre_solicitante: string;
  nombre_proyecto: string;
}

export interface SolicitudData {
  id_administrador: number;
  id_manager?: number;
  id_empleado: number;
  id_rol: number;
  fecha_solicitud: string;
  justificacion: string;
  urgencia: number;
  estado: string;
  comentarios_resolucion: string;
  fecha_resolucion: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Administrator {
  id_administrador: number;
  id_persona: number;
  nivel_acceso: number;
  departamento: string;
  nombre_completo: string;
}
