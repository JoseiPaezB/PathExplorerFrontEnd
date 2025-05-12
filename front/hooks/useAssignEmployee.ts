"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";

interface AssignEmployeeData {
  id_rol: number;
  id_empleado: number | string;
}

export function useAssignEmployee() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignmentResult, setAssignmentResult] = useState<any | null>(null);

  const assignEmployeeToRole = async (
    data: AssignEmployeeData
  ): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${apiUrl}/projects/assign-employee-to-role`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAssignmentResult(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error assigning employee";

      setError(errorMessage);
      console.error("Error assigning employee:", err);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    assignmentResult,
    assignEmployeeToRole,
  };
}
