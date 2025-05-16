"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { Trayectory, GeneratedTrayectoriesResponse } from "@/types/trayectory";

export function fetchGetTrayectoriesByRole(role: string) {
  const [trayectories, setTrayectories] =
    useState<GeneratedTrayectoriesResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrayectoriesByRole = async (): Promise<
    GeneratedTrayectoriesResponse | undefined
  > => {
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
        recommendations: Trayectory[];
      }>(`${apiUrl}/projects/get-user-trajectoria`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrayectories(response.data as GeneratedTrayectoriesResponse);
      return response.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error fetching trayectories";

      setError(errorMessage);
      console.error("Error fetching trayectories:", err);
      setTrayectories(undefined);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTrayectoriesByRole();
  }, []);

  return { trayectories, isLoading, error, fetchGetTrayectoriesByRole };
}
