"use server";
import {
  ProfessionalHistory,
  RawCertification,
  CertificationItem,
  CertificationsArray,
  CertificationsResponse,
} from "@/types/users";

import { revalidatePath } from "next/cache";
export async function getProfessionalHistoryUser(
  token?: string
): Promise<ProfessionalHistory> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(
      "http://localhost:4000/api/auth/professional-history",
      {
        headers: headers,
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al obtener el historial profesional: ${
          errorData?.message || response.statusText
        }`
      );
    }
    const historial: ProfessionalHistory = await response.json();
    revalidatePath("/perfil");
    return historial;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCertificationsUser(
  token?: string
): Promise<CertificationsArray> {
  const header: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    header["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    "http://localhost:4000/api/auth/certifications",
    {
      headers: header,
    }
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Error al obtener las certificaciones: ${
        errorData?.message || response.statusText
      }`
    );
  }

  const certificationsResponse: CertificationsResponse = await response.json();
  const certifications = certificationsResponse.certifications;

  const formattedCertifications: CertificationItem[] = certifications.map(
    (cert: RawCertification) => ({
      id_certificacion: cert.ID_Certificacion,
      nombre: cert.Nombre,
      institucion: cert.Institucion,
      validez:
        typeof cert.Validez === "string"
          ? parseInt(cert.Validez, 10)
          : cert.Validez,
      nivel:
        cert.Nivel !== undefined
          ? typeof cert.Nivel === "string"
            ? parseInt(cert.Nivel, 10)
            : cert.Nivel
          : undefined,
    })
  );

  revalidatePath("/perfil");
  return formattedCertifications;
}
