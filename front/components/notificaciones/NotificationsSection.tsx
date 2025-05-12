import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NotificationResponse } from "@/types/notificaciones";
import NotificationsDetail from "@/components/notificaciones/NotificationDetail";

function NotificationsSection({
  notificationsList,
}: {
  notificationsList: NotificationResponse | null;
}) {
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

export default NotificationsSection;
