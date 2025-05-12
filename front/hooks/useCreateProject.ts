"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";

interface CreateProjectData {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  prioridad: number;
  roles: {
    titulo: string;
    descripcion: string;
    importancia: number;
    nivel_experiencia_requerido: number;
    habilidades: {
      id_habilidad: number;
      nivel_minimo_requerido: number;
      importancia: number;
    }[];
  }[];
}

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProject, setCreatedProject] = useState<any | null>(null);

  const createProject = async (
    projectData: CreateProjectData
  ): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${apiUrl}/projects/create-project`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCreatedProject(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error creating project";

      setError(errorMessage);
      console.error("Error creating project:", err);
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
    createdProject,
    createProject,
  };
}
