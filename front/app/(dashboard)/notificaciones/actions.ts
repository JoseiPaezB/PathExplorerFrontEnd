"use server";
export async function markNotificationAsRead(
  id_notificacion: number,
  token?: string
) {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:4000/api/notifications/mark-notification-as-read`,
      {
        headers,
        cache: "no-store",
        body: JSON.stringify({
          id_notificacion,
        }),
        method: "PATCH",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al marcar la notificacion como leida: ${
          errorData?.message || response.statusText
        }`
      );
    }
  } catch (error) {
    console.error("Error al marcar la notificacion como leida:", error);
    return [];
  }
}
