import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TransformedProject } from "@/types/projectsAdministration";

interface ProjectsListProps {
  projects: TransformedProject[];
  filteredProjects: TransformedProject[];
  setSelectedProject: React.Dispatch<
    React.SetStateAction<TransformedProject | null>
  >;
  setIsDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddRole: (project: TransformedProject) => void;
}

function ProjectsList({
  projects,
  filteredProjects,
  setSelectedProject,
  setIsDetailsModalOpen,
  onAddRole,
}: ProjectsListProps) {
  return (
    <div className="rounded-lg border">
      <div className="grid grid-cols-8 gap-4 p-4 font-medium">
        <div className="col-span-2">Proyecto</div>
        <div>Estado</div>
        <div>Fecha inicio</div>
        <div>Fecha fin</div>
        <div>Timeline</div>
        <div>Acciones</div>
      </div>

      {projects.length > 0 ? (
        filteredProjects.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-8 gap-4 border-t p-4 text-sm items-center"
          >
            <div className="col-span-2">
              <p className="font-medium">{item.project}</p>
            </div>
            <div>
              <Badge
                variant="outline"
                className={
                  item.status === "Pendiente" || item.status === "PLANEACION"
                    ? "bg-yellow-50 text-yellow-700"
                    : item.status === "En progreso" || item.status === "ACTIVO"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-700"
                }
              >
                {item.status}
              </Badge>
            </div>

            <div>{item.startDate}</div>
            <div>{item.endDate}</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Timeline</span>
                <span>{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => {
                  setSelectedProject(item);
                  setIsDetailsModalOpen(true);
                }}
              >
                Ver detalles
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => {
                  if (onAddRole) {
                    onAddRole(item);
                  } else {
                    setSelectedProject(item);
                    setIsDetailsModalOpen(true);
                  }
                }}
              >
                Agregar rol
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No hay proyectos para mostrar.
        </div>
      )}
    </div>
  );
}

export default ProjectsList;
