"use client";
import { useState } from "react";
import axios from "axios";
import { UserInfoBanca } from "@/types/projectsAdministration";
import { apiUrl } from "@/constants";
export function useGetBestCandidates() {
  const [candidates, setCandidates] = useState<UserInfoBanca[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidatesForRole = async (roleId?: number) => {
    if (!roleId) {
      setError("Role ID is required");
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      try {
        const response = await axios.post<any>(
          `${apiUrl}/projects/best-candidates-for-role`,
          { id_rol: roleId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        let candidatos: UserInfoBanca[] = [];

        if (Array.isArray(data)) {
          candidatos = data;
        } else if (data.candidates && Array.isArray(data.candidates)) {
          candidatos = data.candidates;
        } else if (data.data && Array.isArray(data.data)) {
          candidatos = data.data;
        } else if (typeof data === "object" && data !== null) {
          candidatos = [data];
        }

        setCandidates(candidatos);
        return candidatos;
      } catch (bestCandidatesError) {
        console.error("Error fetching best candidates:", bestCandidatesError);

        const backupResponse = await axios.get<UserInfoBanca[]>(
          `${apiUrl}/users/empleados-banca`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const employeesArray = Array.isArray(backupResponse.data)
          ? backupResponse.data
          : [backupResponse.data];

        setCandidates(employeesArray);
        return employeesArray;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unknown error fetching candidates";
      setError(errorMessage);
      console.error("Error getting candidates:", err);
      setCandidates([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    candidates,
    isLoading,
    error,
    fetchCandidatesForRole,
  };
}
