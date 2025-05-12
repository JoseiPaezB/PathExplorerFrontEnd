import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function PageHeader({
  setShowNewProjectDialog,
}: {
  setShowNewProjectDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gestión de Proyectos
        </h1>
        <p className="text-muted-foreground">
          Administra tus proyectos y asignaciones de roles
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="h-8 gap-1 bg-primary hover:bg-primary/90"
          onClick={() => setShowNewProjectDialog(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nuevo Proyecto</span>
        </Button>
      </div>
    </div>
  );
}

export default PageHeader;
