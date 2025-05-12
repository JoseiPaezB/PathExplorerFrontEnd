"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { RequestResponse } from "@/types/requests";
import { apiUrl } from "@/constants";

export function useFetchSolicitudesDeAutorizacion() {
  const [solicitudes, setSolicitudes] = useState<RequestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitudesDeAutorizacion = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";

      const response = await axios.get<RequestResponse>(
        `${apiUrl}/requests/assignment-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSolicitudes(response.data);
    } catch (err) {
      console.error("Error fetching solicitudes de autorizacion:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch solicitudes de autorizacion"
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSolicitudesDeAutorizacion();
  }, []);

  return {
    solicitudes,
    isLoading,
    error,
    fetchSolicitudesDeAutorizacion,
    refetch: fetchSolicitudesDeAutorizacion,
  };
}
