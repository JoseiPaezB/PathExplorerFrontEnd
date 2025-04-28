"use client";

import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Certification, CertificationFormData } from "@/types/certifications";

const CertificationForm = ({
  isLoading,
  certifications,
  formData,
  setFormData,
  setSelectedCertification,
}: {
  isLoading: boolean;
  certifications: Certification[];
  formData: CertificationFormData;
  setFormData: React.Dispatch<React.SetStateAction<CertificationFormData>>;
  setSelectedCertification: React.Dispatch<
    React.SetStateAction<Certification | null>
  >;
}) => {
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
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="id_certificacion" className="text-sm font-medium">
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
          <Label htmlFor="fecha_creacion">Fecha de Creación</Label>
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
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
    </>
  );
};

export default CertificationForm;
