import { useState, useEffect, useCallback } from "react";

interface Course {
  id_curso?: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  proveedor: string;
  duracion: string;
  nivel: string;
  formato: string;
  habilidades?: string[];
  compatibilidad?: number;
}

interface Certification {
  id_certificacion?: number;
  nombre: string;
  descripcion: string;
  entidad_emisora: string;
  validez: string;
  nivel: string;
  tipo: string;
  habilidades?: string[];
  compatibilidad?: number;
}

interface CoursesAndCertsResponse {
  success: boolean;
  message: string;
  recommendations: {
    cursos_recomendados: Course[];
    certificaciones_recomendadas: Certification[];
  };
}

interface CoursesAndCertsFilters {
  coursesCategory: string;
  certificationsAbilities: string;
  coursesAbilities: string;
  coursesProvider: string;
  certificationsProvider: string;
}

export const useFetchCoursesAndCerts = () => {
  const [coursesAndCerts, setCoursesAndCerts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CoursesAndCertsFilters>({
    coursesCategory: "",
    certificationsAbilities: "",
    coursesAbilities: "",
    coursesProvider: "",
    certificationsProvider: "",
  });

  const fetchCoursesAndCerts = useCallback(async (newFilters: Partial<CoursesAndCertsFilters> = {}) => {
    setIsLoading(true);
    try {
      const currentFilters = { ...filters, ...newFilters };
      setFilters(currentFilters);

      // Construir query params
      const queryParams = new URLSearchParams();
      if (currentFilters.coursesCategory) 
        queryParams.append("coursesCategory", currentFilters.coursesCategory);
      if (currentFilters.certificationsAbilities) 
        queryParams.append("certificationsAbilities", currentFilters.certificationsAbilities);
      if (currentFilters.coursesAbilities) 
        queryParams.append("coursesAbilities", currentFilters.coursesAbilities);
      if (currentFilters.coursesProvider) 
        queryParams.append("coursesProvider", currentFilters.coursesProvider);
      if (currentFilters.certificationsProvider) 
        queryParams.append("certificationsProvider", currentFilters.certificationsProvider);

      const response = await fetch(`/api/cursos-y-certificaciones-recomendados?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("No se pudieron obtener los cursos y certificaciones recomendados");
      }

      const data: CoursesAndCertsResponse = await response.json();
      setCoursesAndCerts(data.recommendations);
      setError(null);
    } catch (err) {
      console.error("Error al obtener cursos y certificaciones:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCoursesAndCerts();
  }, [fetchCoursesAndCerts]);

  return {
    coursesAndCerts,
    isLoading,
    error,
    fetchCoursesAndCerts,
    filters,
    setFilters,
  };
};