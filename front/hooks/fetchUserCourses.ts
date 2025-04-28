"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import type { CoursesUserResponse } from "@/types/users";
import { apiUrl } from "@/constants";

export function useFetchUserCourses(userId: string) {
  const [courses, setCourses] = useState<CoursesUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCourses = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";
      const response = await axios.get<CoursesUserResponse>(
        `${apiUrl}/auth/courses?id_persona=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCourses();
  }, [userId]);

  return { courses, isLoading, error, fetchUserCourses };
}
