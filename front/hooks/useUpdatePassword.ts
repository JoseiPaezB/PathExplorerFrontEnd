import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { set } from "date-fns";

export function useUpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || "";

      await axios.patch(
        `${apiUrl}/auth/update-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la contraseña"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updatePassword,
  };
}
