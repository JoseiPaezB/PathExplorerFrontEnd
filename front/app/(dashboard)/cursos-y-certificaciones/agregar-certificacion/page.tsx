"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Certification, CertificationFormData } from "@/types/certifications";
import { fetchGetCertifications } from "@/hooks/fetchGetCertifications";
import { useAddCertification } from "@/hooks/useAddCertification";
import CertificationForm from "@/components/cursos-y-certificaciones/certificaciones/crear-certificaciones/CertificacionesForm";
import SelectedCertificationSection from "@/components/cursos-y-certificaciones/certificaciones/crear-certificaciones/SelectedCertificationSection";
import CertificationsFormFooter from "@/components/cursos-y-certificaciones/certificaciones/crear-certificaciones/CertificationsFormFooter";

export default function AddCertificationForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    certifications,
    isLoading,
    error: fetchError,
  } = fetchGetCertifications();

  const [selectedCertification, setSelectedCertification] =
    useState<Certification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CertificationFormData>({
    id_certificacion: 0,
    fecha_obtencion: "",
    fecha_vencimiento: "",
    estado_validacion: "",
    fecha_creacion: "",
  });
  const { addCertification } = useAddCertification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.id_certificacion ||
      !formData.fecha_obtencion ||
      !formData.fecha_vencimiento ||
      !formData.estado_validacion ||
      !formData.fecha_creacion
    ) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    const completionDate = new Date(formData.fecha_obtencion);
    const dueDate = new Date(formData.fecha_vencimiento);

    if (dueDate < completionDate) {
      setError(
        "La fecha de vencimiento debe ser posterior a la fecha de obtención"
      );
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await addCertification(formData);

      if (!result) {
        setError("Error al agregar la certificación");
        return;
      }

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      setFormData({
        id_certificacion: 0,
        fecha_obtencion: "",
        fecha_vencimiento: "",
        estado_validacion: "",
        fecha_creacion: "",
      });
      setSelectedCertification(null);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Información de la Certificación
          </CardTitle>
          <CardDescription>
            Ingresa los detalles de la certificación que deseas agregar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CertificationForm
            isLoading={isLoading}
            certifications={certifications}
            formData={formData}
            setFormData={setFormData}
            setSelectedCertification={setSelectedCertification}
          />
          {selectedCertification && (
            <SelectedCertificationSection
              selectedCertification={selectedCertification}
            />
          )}
        </CardContent>
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Certificación agregada exitosamente</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="m10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm0-4a1.5 1.5 0 1 1 3 .001v2a1.5 1.5 0 1 1-3-.001V7z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <CertificationsFormFooter isSubmitting={isSubmitting} />
      </Card>
    </form>
  );
}
