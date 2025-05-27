"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { CertificationFormData } from "@/types/users";

export function useEditUserCertification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateCertification, setUpdateCertification] =
    useState<CertificationFormData | null>(null);

  const editCertification = async (
    certificationData: CertificationFormData
  ): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);

      const fullUrl = `${apiUrl}/development/edit-certification`;

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios({
        method: "patch",
        url: fullUrl,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          id_certificacion: Number(certificationData.id_certificacion),
          fecha_obtencion: certificationData.fecha_obtencion,
          fecha_vencimiento: certificationData.fecha_vencimiento || null,
          estado_validacion: Boolean(certificationData.estado_validacion),
          fecha_creacion: certificationData.fecha_creacion,
        },
      });

      setUpdateCertification(response.data.certification);
      return response.data;
    } catch (err) {
      console.error("Error in editCertification:", err);

      if (axios.isAxiosError(err)) {
        console.error("Request failed with status:", err.response?.status);
        console.error("Response data:", err.response?.data);
        console.error("Request config:", {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
          data: err.config?.data,
        });
      }

      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error updating certification";

      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateCertification,
    editCertification,
  };
}
