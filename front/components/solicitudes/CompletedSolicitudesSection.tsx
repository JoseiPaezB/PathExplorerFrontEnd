import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Request } from "@/types/requests";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

function CompletedSolicitudesSection({
  resolvedRequests,
}: {
  resolvedRequests: Request[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Solicitudes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resolvedRequests.length > 0 ? (
            resolvedRequests.map((request, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt={request.nombre_solicitante}
                    />
                    <AvatarFallback>
                      {request.nombre_solicitante
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.nombre_solicitante}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Resuelto: {request.fecha_resolucion}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">
                      {request.comentarios_resolucion}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.nombre_proyecto !== "N/A"
                        ? `Proyecto: ${request.nombre_proyecto}`
                        : "Sin proyecto asociado"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      request.estado === "APROBADA"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }
                  >
                    {request.estado}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No hay solicitudes en el historial
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CompletedSolicitudesSection;
