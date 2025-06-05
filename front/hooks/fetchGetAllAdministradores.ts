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
      const response = await axios.get(`${apiUrl}/requests/administrators`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let administrators: Administrator[] = [];

      if (response.data) {
        if (
          response.data.administrators &&
          Array.isArray(response.data.administrators)
        ) {
          administrators = response.data.administrators;
        } else if (Array.isArray(response.data)) {
          administrators = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          administrators = response.data.data;
        } else if (response.data.success && response.data.administrators) {
          administrators = response.data.administrators;
        } else {
          console.warn("Estructura de respuesta inesperada:", response.data);
        }
      }
      setAdministrador(administrators);
      return administrators;
    } catch (err) {
      let errorMessage = "Error fetching administradores";

      if (axios.isAxiosError(err)) {
        console.error("Axios error details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
        });

        if (err.response?.status === 403) {
          errorMessage =
            "No tienes permisos para ver la lista de administradores";
        } else if (err.response?.status === 401) {
          errorMessage = "Token de autenticación inválido o expirado";
        } else if (err.response?.status === 404) {
          errorMessage = "Endpoint no encontrado";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

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
    refetch: fetchAdministradores,
  };
}
