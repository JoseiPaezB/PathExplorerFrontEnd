"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { CertificationFormData } from "@/types/users";

export function useEditUserCertification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateCertification, setUpdateCertification] = useState<CertificationFormData | null>(null);

  const editCertification = async (certificationData: CertificationFormData): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the exact URL that works in Postman
      const fullUrl = "http://localhost:4000/api/development/edit-certification";
      console.log("Using URL:", fullUrl);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      console.log("Sending Authorization header:", `Bearer ${token}`);
      console.log("Sending data:", JSON.stringify(certificationData, null, 2));
      
      // Make the PATCH request with the exact same format as Postman
      const response = await axios({
        method: 'patch',
        url: fullUrl,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          id_certificacion: Number(certificationData.id_certificacion),
          fecha_obtencion: certificationData.fecha_obtencion,
          fecha_vencimiento: certificationData.fecha_vencimiento || null,
          estado_validacion: Boolean(certificationData.estado_validacion),
          fecha_creacion: certificationData.fecha_creacion
        }
      });

      console.log("Certification update response:", response.data);
      setUpdateCertification(response.data.certification);
      return response.data;
    } catch (err) {
      console.error("Error in editCertification:", err);
      
      // More detailed error logging
      if (axios.isAxiosError(err)) {
        console.error("Request failed with status:", err.response?.status);
        console.error("Response data:", err.response?.data);
        console.error("Request config:", {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
          data: err.config?.data
        });
      }
      
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.message
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