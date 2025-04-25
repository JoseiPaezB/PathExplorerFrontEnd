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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Certification, CertificationFormData } from "@/types/certifications";
import { getCertifications, addCertification } from "./actions";

export default function AddCertificationForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [certifications, setCertifications] = useState<Certification[]>([]);
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

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token") || undefined;
        const data = await getCertifications(token);
        setCertifications(data);
      } catch (err) {
        console.error("Error fetching certifications:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "id_certificacion") {
      const numericValue = parseInt(value, 10);
      setFormData((prev) => {
        return {
          ...prev,
          [name]: numericValue,
        };
      });

      const certification = certifications.find(
        (certification) => certification.id_certificacion === numericValue
      );
      setSelectedCertification(certification || null);
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };
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
      const token = localStorage.getItem("token") || undefined;
      await addCertification(formData, token);

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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="id_curso" className="text-sm font-medium">
                Seleccionar Certificación Existente
              </label>
              <select
                name="id_certificacion"
                id="id_certificacion"
                value={formData.id_certificacion}
                onChange={(e) =>
                  handleSelectChange("id_certificacion", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="" disabled>
                  {isLoading
                    ? "Cargando cursos..."
                    : "Selecciona una certificación"}
                </option>
                {!isLoading &&
                  certifications.map((cert) => (
                    <option
                      key={cert.id_certificacion}
                      value={cert.id_certificacion}
                    >
                      {cert.nombre}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Creación</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fecha_creacion"
                  name="fecha_creacion"
                  type="date"
                  value={formData.fecha_creacion}
                  onChange={handleInputChange}
                  className="h-10 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_obtencion">Fecha de Obtencion</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fecha_obtencion"
                  name="fecha_obtencion"
                  type="date"
                  value={formData.fecha_obtencion}
                  onChange={handleInputChange}
                  className="h-10 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento</Label>
              <div className="relative">
                <Input
                  id="fecha_vencimiento"
                  name="fecha_vencimiento"
                  type="date"
                  value={formData.fecha_vencimiento}
                  onChange={handleInputChange}
                  className="h-10 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado_validacion">Es valido?</Label>
              <Select
                value={formData.estado_validacion}
                onValueChange={(value) =>
                  handleSelectChange("estado_validacion", value)
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
          {selectedCertification && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Certificacion</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={selectedCertification.nombre}
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
                    value={selectedCertification.institucion}
                    className="h-10"
                    disabled
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nivel">Nivel</Label>
                  <Input
                    id="nivel"
                    name="nivel"
                    type="text"
                    value={selectedCertification.nivel}
                    className="h-10"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validez">Validez</Label>
                  <Input
                    id="validez"
                    name="validez"
                    type="text"
                    value={selectedCertification.validez}
                    className="h-10"
                    disabled
                  />
                </div>
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
                    d="M4 1 2a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
