"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { ProjectFormData } from "@/types/projectsAdministration";

export function useEditProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedProject, setUpdatedProject] = useState<ProjectFormData | null>(
    null
  );

  const editProject = async (projectData: ProjectFormData): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.patch(
        `${apiUrl}/projects/edit-project`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUpdatedProject(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error editing project";

      setError(errorMessage);
      console.error("Error editing project:", err);
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
    updatedProject,
    editProject,
  };
}
