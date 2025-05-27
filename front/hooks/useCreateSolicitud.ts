"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { SolicitudData } from "@/types/requests";

export function useCreateSolicitud() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSolicitud = async (
    solicitudData: SolicitudData
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(solicitudData);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${apiUrl}/requests/create-assignment-request`,
        solicitudData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return true;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error creating request ";

      setError(errorMessage);
      console.error("Error creating request:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createSolicitud,
  };
}
