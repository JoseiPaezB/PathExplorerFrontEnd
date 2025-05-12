"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import type { ProfessionalHistory } from "@/types/users";
import { apiUrl } from "@/constants";

export function useFetchUserProfessionalHistory(userId: string) {
  const [professionalHistory, setProfessionalHistory] =
    useState<ProfessionalHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfessionalHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";
      const response = await axios.get<ProfessionalHistory>(
        `${apiUrl}/auth/professional-history?id_persona=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfessionalHistory(response.data);
    } catch (err) {
      console.error("Error fetching professional history:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch professional history"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfessionalHistory();
  }, [userId]);

  return {
    professionalHistory,
    isLoading,
    error,
    fetchUserProfessionalHistory,
  };
}
