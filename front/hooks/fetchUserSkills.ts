"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import type { SkillsResponse } from "@/types/users";
import { apiUrl } from "@/constants";

export function useFetchUserSkills(userId: string) {
  const [skills, setSkills] = useState<SkillsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserSkills = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";
      const response = await axios.get<SkillsResponse>(
        `${apiUrl}/auth/skills?id_persona=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSkills(response.data);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch skills");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSkills();
  }, [userId]);

  return { skills, isLoading, error, fetchUserSkills };
}
