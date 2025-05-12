import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Flag, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/functions";
import { UserTrajectoryResponse } from "@/types/users";

function ProfessionalTrajectorySection({
  userTrajectory,
}: {
  userTrajectory: UserTrajectoryResponse | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-primary" />
          Plan de Carrera
        </CardTitle>
        <CardDescription>
          Objetivos profesionales y plan de desarrollo a corto y largo plazo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {userTrajectory?.trajectory &&
            userTrajectory.trajectory.map((career, index) => (
              <div
                key={career.id_trayectoria}
                className="relative border-l border-primary pl-6"
              >
                <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{career.nombre}</h4>
                    <Badge
                      className={`inline-flex items-center px-3 py-1 whitespace-nowrap ${
                        career.etapa_actual === "Fase inicial"
                          ? "bg-blue-500 text-white"
                          : career.etapa_actual === "Fase intermedia"
                          ? "bg-emerald-500 text-white"
                          : "bg-purple-500 text-white"
                      }`}
                    >
                      {career.etapa_actual}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {career.descripcion}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progreso</span>
                      <span className="font-medium">
                        {parseFloat(career.progreso).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={parseFloat(career.progreso)}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-1 pt-2">
                    <p className="text-sm font-medium">Ruta de Desarrollo:</p>
                    <p className="text-xs text-muted-foreground">
                      {career.roles_secuenciales}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tiempo estimado: {career.tiempo_estimado} meses
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fecha de inicio: {formatDate(career.fecha_inicio)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          <div className="pt-4">
            <h4 className="font-medium mb-4">Metas Profesionales</h4>
            {userTrajectory?.professionalGoals &&
            userTrajectory.professionalGoals.length > 0 ? (
              userTrajectory.professionalGoals.map((goal) => (
                <div
                  key={goal.id_meta}
                  className="relative border-l border-muted pl-6 pb-6"
                >
                  <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{goal.descripcion}</h4>
                      <Badge
                        variant="outline"
                        className={`${
                          goal.estado === "CANCELADA"
                            ? "bg-red-50 text-red-700"
                            : goal.estado === "COMPLETADA"
                            ? "bg-green-50 text-green-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {goal.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Establecida: {formatDate(goal.fecha_establecimiento)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Plazo:{" "}
                      {goal.plazo === "LARGO"
                        ? "Largo plazo"
                        : goal.plazo === "MEDIO"
                        ? "Medio plazo"
                        : "Corto plazo"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prioridad: {goal.prioridad}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay metas profesionales definidas.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfessionalTrajectorySection;
