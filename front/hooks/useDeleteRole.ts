"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";

export function useDeleteRole() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRole = async (id_rol: number, mensaje: string): Promise<any> => {
    try {
      setIsDeleting(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `${apiUrl}/projects/remove-role-from-project`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { id_rol, mensaje },
        }
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error deleting role";

      setError(errorMessage);
      console.error("Error deleting role:", err);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    error,
    deleteRole,
  };
}
