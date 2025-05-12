import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function CursosYCertificacionesHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Cursos y Certificaciones
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu desarrollo profesional y mantén tus certificaciones al día
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/cursos-y-certificaciones/agregar-curso">
          <Button
            size="sm"
            className="h-8 gap-1 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nuevo Curso</span>
          </Button>
        </Link>
        <Link href="/cursos-y-certificaciones/agregar-certificacion">
          <Button
            size="sm"
            className="h-8 gap-1 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nueva Certificación</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CursosYCertificacionesHeader;
