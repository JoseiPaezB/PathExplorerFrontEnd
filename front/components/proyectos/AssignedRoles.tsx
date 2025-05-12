import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/functions";
import { RolesByStatus } from "@/types/projectsAdministration";
function AssignedRoles({ rolesByStatus }: { rolesByStatus: RolesByStatus }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Roles Asignados</h3>
        <Badge variant="outline" className="bg-muted">
          {rolesByStatus.asignados.length}
        </Badge>
      </div>

      {rolesByStatus.asignados.length > 0 ? (
        rolesByStatus.asignados.map((role) => {
          const assignment =
            role.assignments && role.assignments.length > 0
              ? role.assignments[0]
              : null;
          const nombre = assignment?.nombre || "";
          const apellido = assignment?.apellido || "";
          const iniciales = `${nombre.charAt(0) || ""}${
            apellido.charAt(0) || ""
          }`;
          const progress = Math.floor(Math.random() * 80) + 10;

          return (
            <Card key={role.id_rol} className="border-l-4 border-l-green-500">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-base">{role.titulo}</CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    Asignado
                  </Badge>
                </div>
                <CardDescription>
                  Proyecto: {role.project?.nombre || "Sin proyecto"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt={`${nombre} ${apellido}`}
                      />
                      <AvatarFallback>{iniciales}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{`${nombre} ${apellido}`}</p>
                      <p className="text-xs text-muted-foreground">
                        Asignado:{" "}
                        {assignment?.fecha_asignacion ||
                          formatDate(role.project?.fecha_inicio)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso:</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Fecha fin: {formatDate(role.project?.fecha_fin_estimada)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
          <User className="h-8 w-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No hay roles asignados</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Asigna empleados a los roles pendientes para verlos aquí.
          </p>
        </div>
      )}
    </div>
  );
}

export default AssignedRoles;
