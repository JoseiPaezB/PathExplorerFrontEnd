export interface CourseAndCertificate {
  id: number;
  nombre: string;
  institucion: string;
  descripcion: string;
  razon_recomendacion: string;
}

export interface RecommendationCoursesCertificates {
  cursos_recomendados: CourseAndCertificate[];
  certificaciones_recomendadas: CourseAndCertificate[];
}

export interface RecommendationCoursesCertificatesResponse {
  success: boolean;
  message: string;
  recommendations: RecommendationCoursesCertificates;
}

export interface FilterOptionsResponse {
  success: boolean;
  message: string;
  uniqueCategoriesCourses: string[];
  uniqueInstitutionsCourses: string[];
  uniqueInstitutionsCertifications: string[];
  allSkillsNames: string[];
}
