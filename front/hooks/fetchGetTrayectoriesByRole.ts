"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { Trayectory, GeneratedTrayectoriesResponse } from "@/types/trayectory";

export function fetchGetTrayectoriesByRole(role: string = "defaultRole") {
  const [trayectories, setTrayectories] = useState<Trayectory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrayectoriesByRole = async (): Promise<Trayectory[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${apiUrl}/recommendations/development-recommendations`;

      const response = await axios.get<GeneratedTrayectoriesResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role: role,
        },
      });

      if (response.data && response.data.recommendations) {
        setTrayectories(response.data.recommendations);
        return response.data.recommendations;
      } else {
        setTrayectories([]);
        return [];
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error fetching trayectories";

      setError(errorMessage);
      console.error("Error fetching trayectories:", err);
      console.error(
        "Status:",
        axios.isAxiosError(err) ? err.response?.status : "Unknown"
      );
      console.error(
        "URL:",
        `${apiUrl}/recommendations/development-recommendations`
      );

      setTrayectories([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrayectoriesByRole();
  }, []);

  return { trayectories, isLoading, error, fetchTrayectoriesByRole };
}
