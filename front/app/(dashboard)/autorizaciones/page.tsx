"use client";
import { useState, useEffect } from "react";
import { Check, Clock, Filter, Plus, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSolicitudesDeAutorizacion } from "@/app/(dashboard)/autorizaciones/actions";
import { RequestResponse } from "@/types/requests";
import { set } from "date-fns";

export default function AutorizacionesPage() {
  const [solicitudes, setSolicitudes] = useState<RequestResponse | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await getSolicitudesDeAutorizacion(token);
        setSolicitudes(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching solicitudes:", error);
        setError("Failed to fetch solicitudes");
        setIsLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Autorizaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las solicitudes de acceso y permisos
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar solicitudes..."
          className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solicitudes?.requests
              .filter((request) => request.estado === "PENDIENTE")
              .map((request, index) => (
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
                      <p className="font-medium">
                        {request.nombre_solicitante}
                      </p>
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
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solicitudes?.requests
              .filter((request) => request.estado !== "PENDIENTE")
              .map((request, index) => (
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
                      <p className="font-medium">
                        {request.nombre_solicitante}
                      </p>
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
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
