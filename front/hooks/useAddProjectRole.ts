"use client";
import { useState } from "react";
import axios from "axios";
import { RoleFormData } from "@/types/projectsAndRoles";
import { apiUrl } from "@/constants";

export function useAddProjectRole() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const addRoleToProject = async (formData: RoleFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      await axios.post(`${apiUrl}/projects/add-roles-to-project`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsSuccess(true);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al agregar el rol";

      setError(errorMessage);
      console.error("Error adding role:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    isSuccess,
    addRoleToProject,
  };
}
