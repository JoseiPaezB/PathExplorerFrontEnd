"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";

export function useDeleteFeedback() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFeedback = async (id_feedback: number): Promise<any> => {
    try {
      setIsDeleting(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `${apiUrl}/feedback/borrar/${id_feedback}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error deleting feedback";

      setError(errorMessage);
      console.error("Error deleting feedback:", err);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    error,
    deleteFeedback,
  };
}
