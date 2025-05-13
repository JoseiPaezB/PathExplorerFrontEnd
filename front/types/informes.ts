export interface InformesResponse {
  hasInformes: boolean;
  informes: Informes;
}

export interface Informes {
  professionalGoals: MetaProfesional[];
  professionalTrayectory: TrayectoriaProfesional[];
  employeeEvaluations: EvaluacionEmpleado[];
  employeesStates: EstadoEmpleado[];
  requiredAbilitiesForRoles: HabilidadRequeridaRol[];
  employeeCourses: CursoEmpleado[];
  employeeCertifications: CertificacionEmpleado[];
  roles: Rol[];
}

export enum EstadoMeta {
  COMPLETADA = "COMPLETADA",
  EN_PROGRESO = "EN_PROGRESO",
  PENDIENTE = "PENDIENTE",
  CANCELADA = "CANCELADA",
}

export enum PlazoMeta {
  CORTO = "CORTO",
  MEDIANO = "MEDIANO",
  LARGO = "LARGO",
}

export enum EstadoEmpleadoEnum {
  ASIGNADO = "ASIGNADO",
  BANCA = "BANCA",
}

export enum EstadoRol {
  ASIGNADO = "ASIGNADO",
  ABIERTO = "ABIERTO",
}

export enum FaseTrayectoria {
  FASE_INICIAL = "FASE INICIAL",
  FASE_INTERMEDIA = "FASE INTERMEDIA",
  FASE_AVANZADA = "FASE AVANZADA",
}

export interface MetaProfesional {
  id_meta: number;
  id_persona: number;
  plazo: PlazoMeta;
  fecha_establecimiento: string;
  estado: EstadoMeta;
  prioridad: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface TrayectoriaProfesional {
  id_persona: number;
  id_trayectoria: number;
  progreso: string;
  etapa_actual: FaseTrayectoria;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre: string;
  descripcion: string;
  roles_secuenciales: string;
  tiempo_estimado: number;
}

export interface EvaluacionEmpleado {
  id_evaluacion: number;
  id_empleado: number;
  id_manager: number;
  fecha: string;
  areas_mejora: string;
  calificacion: number;
  id_proyecto: number;
  comentarios: string;
  fortalezas: string;
}

export interface EstadoEmpleado {
  id_empleado: number;
  id_persona: number;
  estado: EstadoEmpleadoEnum;
  porcentaje_disponibilidad: string;
}

export interface HabilidadRequeridaRol {
  id_rol: number;
  id_habilidad: number;
  nivel_minimo_requerido: number;
  importancia: number;
  nombre: string;
  titulo: string;
}

export interface CursoEmpleado {
  id_persona: number;
  id_curso: number;
  fecha_inicio: string;
  fecha_finalizacion: string | null;
  calificacion: string | null;
  certificado: boolean;
  fecha_creacion: string | null;
  progreso: string | null;
  nombre: string;
}

export interface CertificacionEmpleado {
  id_persona: number;
  id_certificacion: number;
  fecha_obtencion: string;
  fecha_vencimiento: string | null;
  estado_validacion: boolean;
  fecha_creacion: string;
  nombre: string;
}

export interface Rol {
  id_rol: number;
  titulo: string;
  descripcion: string;
  nivel_experiencia_requerido: number;
  estado: EstadoRol;
  id_proyecto: number;
  id_manager: number;
}

export interface MetricasGenerales {
  totalEmpleados: number;
  empleadosAsignados: number;
  empleadosEnBanca: number;
  totalMetas: number;
  metasCompletadas: number;
  metasEnProgreso: number;
  metasPendientes: number;
  metasCanceladas: number;
  totalCursos: number;
  totalCertificaciones: number;
  totalRoles: number;
  rolesAsignados: number;
  rolesAbiertos: number;
}

export interface AnalisisTrayectoria {
  trayectoria: string;
  totalEmpleados: number;
  porFase: {
    inicial: number;
    intermedia: number;
    avanzada: number;
  };
  progresoPromedio: number;
}

export interface CertificacionPorVencer {
  nombre: string;
  cantidadEmpleados: number;
  diasParaVencer: number;
  fechaVencimiento: string;
}

export interface FiltrosInforme {
  fechaInicio?: string;
  fechaFin?: string;
  idManager?: number;
  idProyecto?: number;
  estado?: string;
  categoria?: string;
}

export enum FormatoExportacion {
  PDF = "PDF",
  EXCEL = "EXCEL",
  CSV = "CSV",
  POWERPOINT = "POWERPOINT",
}

export interface OpcionesExportacion {
  formato: FormatoExportacion;
  incluirGraficos: boolean;
  incluirTablas: boolean;
  incluirResumenEjecutivo: boolean;
  filtros?: FiltrosInforme;
}
