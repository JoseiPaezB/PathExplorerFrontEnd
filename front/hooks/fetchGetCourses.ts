import { useState, useEffect } from "react";
import axios from "axios";
import { Course } from "@/types/courses";
import { apiUrl } from "@/constants";

export function fetchGetCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      const response = await axios.get(`${apiUrl}/development/all-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCourses(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al obtener cursos";

      setError(errorMessage);
      console.error("Error fetching courses:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return {
    courses,
    isLoading,
    error,
  };
}
