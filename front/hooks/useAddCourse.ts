import { useState } from "react";
import axios from "axios";
import { CourseFormData } from "@/types/courses";
import { apiUrl } from "@/constants";
export function useAddCourse() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const addCourse = async (formData: CourseFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      await axios.post(`${apiUrl}/development/create-course`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al agregar el curso";

      setError(errorMessage);
      console.error("Error adding course:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    isSuccess,
    addCourse,
  };
}
