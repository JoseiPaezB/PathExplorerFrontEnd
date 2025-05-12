import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Course, CourseFormData } from "@/types/courses";

function CursosForm({
  setFormData,
  formData,
  courses,
  setSelectedCourse,
  isLoading,
}: {
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
  formData: CourseFormData;
  courses: Course[];
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  isLoading: boolean;
}) {
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
  return (
    <>
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
            onValueChange={(value) => handleSelectChange("certificado", value)}
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
          <Label htmlFor="calificacion">Calificación</Label>
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
    </>
  );
}

export default CursosForm;
