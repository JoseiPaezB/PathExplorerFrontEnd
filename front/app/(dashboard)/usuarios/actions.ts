"use server";
import { UserInfoBancaResponse } from "@/types/users";

import { revalidatePath } from "next/cache";
export async function getEmpleadosBanca(
  token?: string
): Promise<UserInfoBancaResponse> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch("http://localhost:4000/api/banca/empleados", {
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al obtener los empleados en estado de banca: ${
          errorData?.message || response.statusText
        }`
      );
    }

    const empleados: UserInfoBancaResponse = await response.json();
    revalidatePath("/usuarios");
    return empleados;
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    return {} as UserInfoBancaResponse;
  }
}
