import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { RecommendationCoursesCertificatesResponse } from "@/types/recommendations";
import { set } from "date-fns";

export function fetchGetCoursesAndCertificationsRecommendations() {
  const [recommendations, setRecommendations] =
    useState<RecommendationCoursesCertificatesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCoursesAndCertificationsRecommendations = async (
    coursesCategory: string | null = null,
    coursesProvider: string | null = null,
    coursesAbilities: string | null = null,
    certificationsProvider: string | null = null,
    certificationsAbilities: string | null = null
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token") || "";
      const filters = {
        category: coursesCategory,
        certificationsAbilities,
        coursesAbilities,
        coursesProvider,
        certificationsProvider,
      };

      if (filters.certificationsProvider) {
        filters.certificationsProvider = filters.certificationsProvider.replace(
          /[^a-zA-Z0-9\s]/g,
          ""
        );
      }

      const queryParams = Object.entries(filters)
        .filter(([_, value]) => value !== null)
        .map(
          ([key, value], index) =>
            `${index === 0 ? "?" : "&"}${key}=${encodeURIComponent(
              String(value)
            )}`
        )
        .join("");

      const completeApiUrl = `${apiUrl}/recommendations/cursos-y-certificaciones-recomendados${queryParams}`;

      const response = await axios.get(completeApiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setRecommendations(response.data);
      setIsLoading(false);
      setError(null);
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al obtener recomendaciones";

      setError(errorMessage);
      console.error("Error fetching recommendations:", error);
      return [];
    }
  };

  useEffect(() => {
    getCoursesAndCertificationsRecommendations();
  }, []);

  return {
    recommendations,
    getCoursesAndCertificationsRecommendations,
    isLoading,
    error,
  };
}
