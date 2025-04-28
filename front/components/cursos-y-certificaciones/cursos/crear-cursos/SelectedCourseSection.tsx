import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Course } from "@/types/courses";
import { Textarea } from "@/components/ui/textarea";

function SelectedCourseSection({ selectedCourse }: { selectedCourse: Course }) {
  return (
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
  );
}

export default SelectedCourseSection;
