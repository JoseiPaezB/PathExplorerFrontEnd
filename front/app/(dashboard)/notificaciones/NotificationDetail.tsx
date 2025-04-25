import { Notification } from "@/types/notificaciones";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { markNotificationAsRead } from "./actions";

export default function NotificationDetail({
  notification,
}: {
  notification: Notification;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRead, setIsRead] = useState(notification.leida);
  const handleMarkAsRead = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await markNotificationAsRead(notification.id_notificacion, token || "");
      setIsRead(true);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="border border-solid border-gray-200 rounded-md p-4 w-full mb-2 shadow-sm">
      <h2 className="font-medium text-base">{notification.titulo}</h2>
      <p className="text-sm text-gray-600 my-2">{notification.mensaje}</p>
      <p className="text-xs text-gray-500 mb-3">
        {notification.fecha_creacion}
      </p>
      <div className="flex justify-end">
        <Button
          className="bg-primary hover:bg-primary/90 h-8"
          size="sm"
          onClick={handleMarkAsRead}
          disabled={isLoading || isRead}
        >
          {isLoading ? "Procesando..." : isRead ? "Leída" : "Marcar como leída"}
        </Button>
      </div>
    </div>
  );
}
