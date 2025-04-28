"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";

interface Skill {
  id_habilidad: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
}

export function fetchGetAllSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async (): Promise<Skill[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get<{ success: boolean; skills: Skill[] }>(
        `${apiUrl}/projects/all-skills`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSkills(response.data.skills);
        return response.data.skills;
      }

      setSkills([]);
      return [];
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error fetching skills";

      setError(errorMessage);
      console.error("Error fetching skills:", err);
      setSkills([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return {
    skills,
    isLoading,
    error,
    refreshSkills: fetchSkills,
  };
}
