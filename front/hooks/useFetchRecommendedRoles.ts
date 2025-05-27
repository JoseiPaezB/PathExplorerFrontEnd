import { useState, useEffect, useCallback } from "react";

interface Skill {
  id_habilidad: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  nivel_minimo_requerido: number;
  importancia: string;
}

interface Manager {
  id_persona: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  estado: string;
}

interface Role {
  id_rol: number;
  titulo: string;
  descripcion: string;
  nivel_experiencia_requerido: string;
  id_proyecto: number;
  id_manager: number;
  skills?: Skill[];
  manager?: Manager[];
  project?: Project[];
  compatibilidad?: number;
}

interface RecommendedRole {
  id_rol: number;
  titulo: string;
  descripcion: string;
  compatibilidad: number;
  roleWithProject: Role;
}

interface RolesFilters {
  roleSkills: string;
  roleState: string;
}

export const useFetchRecommendedRoles = () => {
  const [recommendedRoles, setRecommendedRoles] = useState<RecommendedRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RolesFilters>({
    roleSkills: "",
    roleState: "",
  });

  const fetchRecommendedRoles = useCallback(async (newFilters: Partial<RolesFilters> = {}) => {
    setIsLoading(true);
    try {
      const currentFilters = { ...filters, ...newFilters };
      setFilters(currentFilters);

      // Construir query params
      const queryParams = new URLSearchParams();
      if (currentFilters.roleSkills) queryParams.append("roleSkills", currentFilters.roleSkills);
      if (currentFilters.roleState) queryParams.append("roleState", currentFilters.roleState);

      const token = localStorage.getItem("token") || "";
      const response = await fetch(`/api/recommendations/roles-recomendados?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudieron obtener los roles recomendados");
      }

      const data = await response.json();
      setRecommendedRoles(data.recommendations);
      setError(null);
    } catch (err) {
      console.error("Error al obtener roles recomendados:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendedRoles();
  }, [fetchRecommendedRoles]);

  return {
    recommendedRoles,
    isLoading,
    error,
    fetchRecommendedRoles,
    filters,
    setFilters,
  };
};