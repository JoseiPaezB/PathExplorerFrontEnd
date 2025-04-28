import { useState, useEffect } from "react";
import axios from "axios";
import { Certification } from "@/types/certifications";
import { apiUrl } from "@/constants";
export function fetchGetCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertifications = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      const response = await axios.get(
        `${apiUrl}/development/all-certifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCertifications(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al obtener certificaciones";

      setError(errorMessage);
      console.error("Error fetching certifications:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  return {
    certifications,
    isLoading,
    error,
    fetchCertifications,
  };
}
