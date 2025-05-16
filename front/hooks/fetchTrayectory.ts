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

      const response = await axios.get<{
        success: boolean;
        message: string;
        trayectoria: Trayectory;
      }>(`${apiUrl}/recommendations/get-user-trajectoria`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrayectory(response.data as TrayectoryResponse);
      return response.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error fetching trayectory";

      setError(errorMessage);
      console.error("Error fetching trayectory:", err);
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
