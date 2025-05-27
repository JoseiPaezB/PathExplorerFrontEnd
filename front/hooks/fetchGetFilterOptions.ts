import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { FilterOptionsResponse } from "@/types/recommendations";

export function fetchGetFilterOptions() {
  const [filters, setFilters] = useState<FilterOptionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFilterOptions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      const response = await axios.get(
        `${apiUrl}/recommendations/filter-options`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFilters(response.data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al obtener las opciones de filtro";

      setError(errorMessage);
      console.error("Error fetching filter options:", error);
      return [];
    }
  };

  useEffect(() => {
    getFilterOptions();
  }, []);

  return {
    filters,
    isLoading,
    error,
  };
}
