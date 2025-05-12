import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";

export function useAssignmentRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAssignmentRequestForm = async (
    id_solicitud: number,
    estado: string,
    comentarios_resolucion: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || "";

      await axios.patch(
        `${apiUrl}/requests/update-assignment-request`,
        { id_solicitud, estado, comentarios_resolucion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return true;
    } catch (err) {
      console.error("Error updating assignment request:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update assignment request"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateAssignmentRequestForm,
  };
}
