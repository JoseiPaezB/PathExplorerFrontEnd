"use client";

import { useState, useEffect } from "react";
import { Calendar, BookOpen } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { addCourse, getCourses } from "./actions";
import { Course, CourseFormData } from "@/types/courses";

export default function AddCourseForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token") || undefined;
        const data = await getCourses(token);
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "calificacion") {
      const numericValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numericValue) ? null : numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "id_curso") {
      const numericValue = parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));

      const course = courses.find((course) => course.id_curso === numericValue);
      setSelectedCourse(course || null);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token") || undefined;
      await addCourse(formData, token);

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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="id_curso" className="text-sm font-medium">
                Seleccionar Curso Existente
              </label>
              <select
                name="id_curso"
                id="id_curso"
                value={formData.id_curso}
                onChange={(e) => handleSelectChange("id_curso", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="" disabled>
                  {isLoading ? "Cargando cursos..." : "Selecciona un curso"}
                </option>
                {!isLoading &&
                  courses.map((course) => (
                    <option key={course.id_curso} value={course.id_curso}>
                      {course.nombre}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificado">Tiene certificado?</Label>
              <Select
                value={formData.certificado}
                onValueChange={(value) =>
                  handleSelectChange("certificado", value)
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="t">Sí</SelectItem>
                  <SelectItem value="f">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fecha_inicio"
                  name="fecha_inicio"
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={handleInputChange}
                  className="h-10 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_finalizacion">Fecha de Finalización</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fecha_finalizacion"
                  name="fecha_finalizacion"
                  type="date"
                  value={formData.fecha_finalizacion ?? ""}
                  onChange={handleInputChange}
                  className="h-10 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calificacion">Calificacion</Label>
              <div className="relative">
                <Input
                  id="calificacion"
                  name="calificacion"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.calificacion ?? ""}
                  onChange={handleInputChange}
                  className="h-10 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progreso">Progreso</Label>
              <div className="relative">
                <Input
                  id="progreso"
                  name="progreso"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.progreso}
                  onChange={handleInputChange}
                  className="h-10 pl-10"
                />
              </div>
            </div>
          </div>
          {selectedCourse && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Curso</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={selectedCourse.nombre}
                    className="h-10"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institucion">Institución</Label>
                  <Input
                    id="institucion"
                    name="institucion"
                    type="text"
                    value={selectedCourse.institucion}
                    className="h-10"
                    disabled
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={selectedCourse.descripcion}
                    className="h-10"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modalidad">Modalidad</Label>
                  <Input
                    id="modalidad"
                    name="modalidad"
                    type="text"
                    value={selectedCourse.modalidad}
                    className="h-10"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    name="categoria"
                    type="text"
                    value={selectedCourse.categoria}
                    className="h-10"
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracion">Duración</Label>
                <Input
                  id="duracion"
                  name="duracion"
                  type="text"
                  value={selectedCourse.duracion}
                  className="h-10"
                  disabled
                />
              </div>
            </>
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
        <CardFooter className="flex justify-between border-t pt-6">
          <Link href="/cursos-y-certificaciones">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button
            className="bg-primary hover:bg-primary/90"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              "Guardar Curso"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
