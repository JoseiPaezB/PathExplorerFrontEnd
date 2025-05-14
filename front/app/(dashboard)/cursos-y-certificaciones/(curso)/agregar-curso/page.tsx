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
import { Course, CourseFormData } from "@/types/courses";
import { fetchGetCourses } from "@/hooks/fetchGetCourses";
import { useAddCourse } from "@/hooks/useAddCourse";
import CursosForm from "@/components/cursos-y-certificaciones/cursos/crear-cursos/CursosForm";
import SelectedCourseSection from "@/components/cursos-y-certificaciones/cursos/crear-cursos/SelectedCourseSection";
import CoursesFormFooter from "@/components/cursos-y-certificaciones/cursos/crear-cursos/CoursesFormFooter";

export default function AddCourseForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { courses, isLoading } = fetchGetCourses();
  const { addCourse, error: courseError } = useAddCourse();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    id_curso: 0,
    fecha_inicio: "",
    fecha_finalizacion: null,
    calificacion: null,
    certificado: "",
    progreso: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id_curso || !formData.fecha_inicio || !formData.certificado) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    const progress = formData.progreso ? parseFloat(formData.progreso) : 0;

    if (progress === 100) {
      if (!formData.fecha_finalizacion) {
        setError(
          "Para un curso completado, la fecha de finalización es obligatoria."
        );
        return;
      }

      if (formData.calificacion === null) {
        setError("Para un curso completado, la calificación es obligatoria.");
        return;
      }
    }

    if (formData.fecha_finalizacion) {
      const startDate = new Date(formData.fecha_inicio);
      const endDate = new Date(formData.fecha_finalizacion);

      if (endDate < startDate) {
        setError(
          "La fecha de finalización debe ser posterior a la fecha de inicio"
        );
        return;
      }

      if (!formData.progreso || formData.progreso !== "100") {
        setError("El progreso debe ser 100 si ya se ha terminado el curso.");
        return;
      }

      if (!formData.calificacion) {
        setError("La calificacion es obligatoria.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await addCourse(formData);

      if (!result) {
        setError(courseError);
        return;
      }

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      setFormData({
        id_curso: 0,
        fecha_inicio: "",
        fecha_finalizacion: "",
        calificacion: null,
        certificado: "",
        progreso: "",
      });
      setSelectedCourse(null);
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
            Información del Curso
          </CardTitle>
          <CardDescription>
            Ingresa los detalles del curso que deseas agregar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CursosForm
            setFormData={setFormData}
            formData={formData}
            courses={courses}
            setSelectedCourse={setSelectedCourse}
            isLoading={isLoading}
          />
          {selectedCourse && (
            <SelectedCourseSection selectedCourse={selectedCourse} />
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
            <span>Curso agregado exitosamente</span>
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
        <CoursesFormFooter isSubmitting={isSubmitting} />
      </Card>
    </form>
  );
}
