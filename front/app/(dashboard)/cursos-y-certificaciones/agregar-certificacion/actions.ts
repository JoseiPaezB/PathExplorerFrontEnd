"use server";

import { revalidatePath } from "next/cache";
import { Certification, CertificationFormData } from "@/types/certifications";
export async function getCertifications(
  token?: string
): Promise<Certification[]> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:4000/api/development/all-certifications`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al obtener certificaciones: ${
          errorData?.message || response.statusText
        }`
      );
    }

    const certifications: Certification[] = await response.json();
    return certifications;
  } catch (error) {
    console.error("Error al obtener certificaciones:", error);
    return [];
  }
}

export async function addCertification(
  formData: CertificationFormData,
  token?: string
): Promise<Certification> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      "http://localhost:4000/api/development/create-certification",
      {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al agregar certificacion: ${
          errorData?.message || response.statusText
        }`
      );
    }

    revalidatePath("/cursos-y-certificaciones");

    return await response.json();
  } catch (error) {
    console.error("Error guardando certificacion:", error);
    throw error;
  }
}
