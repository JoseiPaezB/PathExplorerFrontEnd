"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { Administrator } from "@/types/requests";

export function fetchGetAllAdministradores() {
  const [administrador, setAdministrador] = useState<Administrator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdministradores = async (): Promise<Administrator[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get<{
        hasRequests: true;
        administrators: Administrator[];
      }>(`${apiUrl}/requests/administrators`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setAdministrador(response.data.administrators);
        return response.data.administrators;
      }

      setAdministrador([]);
      return [];
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error fetching administradores";

      setError(errorMessage);
      console.error("Error fetching administradores:", err);
      setAdministrador([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdministradores();
  }, []);

  return {
    administrador,
    isLoading,
    error,
  };
}
