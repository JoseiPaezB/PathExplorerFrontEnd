export interface Notification {
  id_notificacion: number;
  id_persona: number;
  tipo: "ASIGNACION" | string;
  titulo: string;
  mensaje: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA" | string;
  leida: boolean;
  fecha_lectura: string | null;
  fecha_creacion: string;
}

export interface NotificationResponse {
  hasNotifications: boolean;
  notifications: Notification[];
}
