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
