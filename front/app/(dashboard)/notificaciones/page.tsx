"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { NotificationResponse } from "@/types/notificaciones";
import NotificationsSection from "@/components/notificaciones/NotificationsSection";
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

  return <NotificationsSection notificationsList={notificationsList} />;
}

export default page;
