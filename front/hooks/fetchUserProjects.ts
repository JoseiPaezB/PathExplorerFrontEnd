"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import type { ProjectsAndRoles } from "@/types/projectsAndRoles";
import { apiUrl } from "@/constants";

export function useFetchUserProjects(employeeId: number) {
  const [projects, setProjects] = useState<ProjectsAndRoles | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProjects = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";

      const response = await axios.post<ProjectsAndRoles>(
        `${apiUrl}/projects/user-project-and-role`,
        { id_empleado: employeeId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching user project:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch user projects"
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProjects();
  }, []);

  return { projects, isLoading, error, fetchUserProjects };
}
