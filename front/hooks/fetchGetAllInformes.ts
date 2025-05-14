"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { InformesResponse } from "@/types/informes";
export function fetchGetAllInformes() {
  const [informes, setInformes] = useState<InformesResponse | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInformes = async (): Promise<InformesResponse | undefined> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${apiUrl}/informes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInformes(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error fetching informes";

      setError(errorMessage);
      console.error("Error fetching informes:", err);
      setInformes(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInformes();
  }, []);

  return {
    informes,
    isLoading,
    error,
  };
}
