"use server";
import { ProjectAndRoles } from "@/types/projectAndRoles";

export async function getUserProjectAndRole(
  id_empleado: string,
  token: string
): Promise<ProjectAndRoles> {
  if (!id_empleado) {
    throw new Error("ID del empleado es requerido");
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      "http://localhost:4000/api/projects/user-project-and-role",
      {
        headers: headers,
        body: JSON.stringify({
          id_empleado: id_empleado,
        }),
        method: "POST",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener los detalles del proyecto"
      );
    }

    const data = await response.json();
    return data as ProjectAndRoles;
  } catch (error) {
    console.error("Error fetching user project and role:", error);
    throw error;
  }
}
