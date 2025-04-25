"use client";
import { useState, useEffect } from "react";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { NotificationResponse } from "@/types/notificaciones";
import NotificationsDetail from "./NotificationDetail";
function page() {
  const { notifications } = useAuth();
  const [notificationsList, setNotificationsList] =
    useState<NotificationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notifications();
        setNotificationsList(response);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [notifications]);

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Notificaciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 pt-6">
          {notificationsList &&
            Array.isArray(notificationsList.notifications) &&
            notificationsList.notifications.map((notification) => (
              <NotificationsDetail
                key={notification.id_notificacion}
                notification={notification}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default page;
