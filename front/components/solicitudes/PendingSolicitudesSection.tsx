import { Button } from "@/components/ui/button";
import { Check, Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Request } from "@/types/requests";

function PendingSolicitudesSection({
  pendingRequests,
  handleOpenDetailsModal,
}: {
  pendingRequests: Request[];
  handleOpenDetailsModal: (id: number, action: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes Pendientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRequests.map((request, index) => (
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
                    <span>Solicitado: {request.fecha_solicitud}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">{request.justificacion}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.nombre_proyecto}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700"
                >
                  {request.estado}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-green-500 hover:text-green-600"
                    onClick={() =>
                      handleOpenDetailsModal(request.id_solicitud, "APROBADA")
                    }
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() =>
                      handleOpenDetailsModal(request.id_solicitud, "RECHAZADA")
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {pendingRequests.length === 0 && (
            <p className="text-center text-muted-foreground">
              No hay solicitudes pendientes
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PendingSolicitudesSection;
