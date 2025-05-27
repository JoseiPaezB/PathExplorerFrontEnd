import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/functions";
import { Role } from "@/types/projectsAdministration";

interface PendingRolesProps {
  rolesByStatus: any;
  determineUrgency: (role: Role) => string;
  handleAssignClick: (project: string, role: string, roleId?: number) => void;
  handleDeleteClick?: (role: Role) => void;
}

function PendingRoles({
  rolesByStatus,
  determineUrgency,
  handleAssignClick,
  handleDeleteClick,
}: PendingRolesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Roles por Llenar</h3>
        <Badge variant="outline" className="bg-muted">
          {rolesByStatus.pendientes.length}
        </Badge>
      </div>

      {rolesByStatus.pendientes.length > 0 ? (
        rolesByStatus.pendientes.map((role: any) => (
          <Card
            key={role.id_rol}
            className={`border-l-4 ${
              determineUrgency(role) === "Urgente"
                ? "border-l-yellow-500"
                : "border-l-blue-500"
            }`}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-base">{role.titulo}</CardTitle>
                <Badge
                  variant="outline"
                  className={
                    determineUrgency(role) === "Urgente"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-blue-50 text-blue-700"
                  }
                >
                  {determineUrgency(role)}
                </Badge>
              </div>
              <CardDescription>
                Proyecto: {role.project?.nombre || "Sin proyecto"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fecha inicio:</span>
                  <span>{formatDate(role.project?.fecha_inicio)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duración:</span>
                  <span>
                    {role.project?.fecha_inicio &&
                    role.project?.fecha_fin_estimada
                      ? `${Math.ceil(
                          (new Date(role.project.fecha_fin_estimada).getTime() -
                            new Date(role.project.fecha_inicio).getTime()) /
                            (1000 * 60 * 60 * 24 * 30)
                        )} meses`
                      : "No definida"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <Button
                size="sm"
                className="h-8 bg-primary hover:bg-primary/90"
                onClick={() =>
                  handleAssignClick(
                    role.project?.nombre || "",
                    role.titulo,
                    role.id_rol
                  )
                }
              >
                Asignar
              </Button>
              {handleDeleteClick && (
                <Button
                  size="sm"
                  className="h-8 bg-primary hover:bg-primary/90"
                  onClick={() => handleDeleteClick(role)}
                >
                  Borrar
                </Button>
              )}
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
          <Plus className="h-8 w-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No hay roles pendientes</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Todos los roles han sido asignados o no hay proyectos registrados.
          </p>
        </div>
      )}
    </div>
  );
}

export default PendingRoles;
