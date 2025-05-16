"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { Trayectory, TrayectoryResponse } from "@/types/trayectory";

export function fetchTrayectory() {
  const [trayectory, setTrayectory] = useState<TrayectoryResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrayectory = async (): Promise<TrayectoryResponse | undefined> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${apiUrl}/recommendations/get-user-trajectoria`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        if (response.data.trayectoria) {
          setTrayectory(response.data as TrayectoryResponse);
        } else {
          setTrayectory({
            success: response.data.success,
            message: response.data.message,
            trayectoria: undefined,
          });
        }
        return response.data as TrayectoryResponse;
      } else {
        console.error("Respuesta inesperada:", response.data);
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error fetching trayectory";

      console.error("Error detallado:", err);

      setError(errorMessage);
      setTrayectory(undefined);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrayectory();
  }, []);

  return { trayectory, isLoading, error, fetchTrayectory };
}
