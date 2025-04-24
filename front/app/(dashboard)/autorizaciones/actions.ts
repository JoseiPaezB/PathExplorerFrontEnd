"use server";
import { revalidatePath } from "next/cache";
import { RequestResponse } from "@/types/requests";

const apiUrl = "http://localhost:4000/api";
export async function getSolicitudesDeAutorizacion(
  token: string | null
): Promise<RequestResponse | null> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${apiUrl}/requests/assignment-requests`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al recibir solicitudes: ${
          errorData?.message || response.statusText
        }`
      );
    }

    revalidatePath("/autorizaciones");

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo solicitudes para autorizar:", error);
    throw error;
  }
}

export async function updateAssignmentRequestForm(
  id_solicitud: number,
  estado: string,
  comentarios_resolucion: string,
  token: string | null
): Promise<void> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${apiUrl}/requests/update-assignment-request`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          id_solicitud,
          estado,
          comentarios_resolucion,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al actualizar la solicitud: ${
          errorData?.message || response.statusText
        }`
      );
    }

    revalidatePath("/autorizaciones");
  } catch (error) {
    console.error("Error actualizando la solicitud:", error);
    throw error;
  }
}
