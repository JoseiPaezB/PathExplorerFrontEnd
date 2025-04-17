export type Course = {
  id_curso: number;
  nombre: string;
  institucion: string;
  descripcion: string;
  duracion: number;
  modalidad: string;
};

export type CourseFormData = {
  id_curso: number;
  fecha_inicio: string;
  fecha_finalizacion: string;
  calificacion: number | null;
  certificado: string;
};
