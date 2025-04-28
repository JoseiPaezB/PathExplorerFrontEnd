import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";

export function useMarkNotificationsAsRead() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markNotificationAsRead = async (id_notificacion: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || "";

      await axios.patch(
        `${apiUrl}/notifications/mark-notification-as-read`,
        { id_notificacion: id_notificacion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al marcar la notificación como leída"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    markNotificationAsRead,
  };
}
