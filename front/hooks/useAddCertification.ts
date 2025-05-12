import { useState } from "react";
import axios from "axios";
import { CertificationFormData } from "@/types/certifications";
import { apiUrl } from "@/constants";

export function useAddCertification() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const addCertification = async (formData: CertificationFormData) => {
    if (
      !formData.id_certificacion ||
      !formData.fecha_obtencion ||
      !formData.fecha_vencimiento ||
      !formData.estado_validacion ||
      !formData.fecha_creacion
    ) {
      setError("Por favor completa todos los campos requeridos.");
      return false;
    }

    const completionDate = new Date(formData.fecha_obtencion);
    const dueDate = new Date(formData.fecha_vencimiento);

    if (dueDate < completionDate) {
      setError(
        "La fecha de vencimiento debe ser posterior a la fecha de obtención"
      );
      return false;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      await axios.post(`${apiUrl}/development/create-certification`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al agregar la certificación";

      setError(errorMessage);
      console.error("Error adding certification:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    isSuccess,
    addCertification,
  };
}
