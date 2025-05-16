"use client";
import { useState } from "react";
import axios from "axios";
import { TrayectoryFormData } from "@/types/trayectory";
import { apiUrl } from "@/constants";

export function useAddTrayectory() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const addTrayectory = async (formData: TrayectoryFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      await axios.post(
        `${apiUrl}/recommendations/development-recommendations`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al agregar la trayectoria";

      setError(errorMessage);
      console.error("Error adding trayectory:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    isSuccess,
    addTrayectory,
  };
}
