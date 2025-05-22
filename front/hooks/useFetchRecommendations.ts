import { useState, useEffect, useCallback } from "react";

interface Trayectoria {
  nombre: string;
  descripcion: string;
  roles_secuenciales: string;
  tiempo_estimado: number;
  compatibilidad?: number;
}

interface RecommendationsResponse {
  success: boolean;
  message: string;
  recommendations: {
    trayectorias_recomendadas: Trayectoria[];
  };
}

export const useFetchRecommendations = () => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/development-recommendations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("No se pudieron obtener las recomendaciones");
      }

      const data: RecommendationsResponse = await response.json();
      setRecommendations(data.recommendations);
      setError(null);
    } catch (err) {
      console.error("Error al obtener recomendaciones:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, isLoading, error, fetchRecommendations };
};