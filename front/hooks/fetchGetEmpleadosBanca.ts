"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserInfoBancaResponse } from "@/types/users";
import { apiUrl } from "@/constants";

export function useFetchGetEmpleadosBanca() {
  const [empleadosBanca, setEmpleadosBanca] =
    useState<UserInfoBancaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpleadosBanca = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";

      const response = await axios.get<UserInfoBancaResponse>(
        `${apiUrl}/banca/empleados`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmpleadosBanca(response.data);
    } catch (err) {
      console.error("Error fetching empleados banca:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch empleados banca"
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchEmpleadosBanca();
  }, []);

  return { empleadosBanca, isLoading, error, fetchEmpleadosBanca };
}
