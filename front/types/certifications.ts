export type Certification = {
  id_certificacion: number;
  nombre: string;
  institucion: string;
  validez: string;
  nivel: string;
};

export type CertificationFormData = {
  id_certificacion: number;
  fecha_obtencion: string;
  fecha_vencimiento: string;
  estado_validacion: string;
  fecha_creacion: string;
};
