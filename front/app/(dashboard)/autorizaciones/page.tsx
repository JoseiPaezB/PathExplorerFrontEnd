"use client";
import { useState, useEffect } from "react";
import { Check, Clock, Search, X, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getSolicitudesDeAutorizacion,
  updateAssignmentRequestForm,
} from "@/app/(dashboard)/autorizaciones/actions";
import { RequestResponse, Request } from "@/types/requests";
import AutorizationDetailModal from "./autorizationDetail";

export default function AutorizacionesPage() {
  const [solicitudes, setSolicitudes] = useState<RequestResponse | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState<number | null>(
    null
  );
  const [actionType, setActionType] = useState<string>("");

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await getSolicitudesDeAutorizacion(token);
        setSolicitudes(response);

        if (response && response.requests) {
          setFilteredSolicitudes(response.requests);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching solicitudes:", error);
        setError("Failed to fetch solicitudes");
        setIsLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    if (solicitudes?.requests) {
      applyFilters();
    }
  }, [solicitudes, searchTerm, filtro]);

  const handleOpenDetailsModal = (id: number, action: string) => {
    setSelectedSolicitudId(id);
    setActionType(action);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedSolicitudId(null);
  };

  const handleSubmit = async (
    id_solicitud: number,
    estado: string,
    comentarios_resolucion: string
  ) => {
    const token = localStorage.getItem("token");
    try {
      await updateAssignmentRequestForm(
        id_solicitud,
        estado,
        comentarios_resolucion,
        token
      );
      setIsDetailsModalOpen(false);

      const response = await getSolicitudesDeAutorizacion(token);
      setSolicitudes(response);
    } catch (error) {
      console.error("Error updating assignment request:", error);
    }
  };

  const handleFilter = (selectedFilter: string) => {
    setFiltro(selectedFilter);
  };

  const applyFilters = () => {
    if (!solicitudes?.requests) return;

    const currentSearchTerm = searchTerm.toLowerCase();
    let result = [...solicitudes.requests];

    if (filtro) {
      result = result.filter((request) => request.estado === filtro);
    }

    if (currentSearchTerm) {
      result = result.filter(
        (solicitud) =>
          solicitud.nombre_solicitante
            .toLowerCase()
            .includes(currentSearchTerm) ||
          solicitud.nombre_proyecto.toLowerCase().includes(currentSearchTerm)
      );
    }

    setFilteredSolicitudes(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const pendingRequests = filteredSolicitudes.filter(
    (request) => request.estado === "PENDIENTE"
  );

  const resolvedRequests = filteredSolicitudes.filter(
    (request) => request.estado !== "PENDIENTE"
  );

  if (isLoading) {
    return <div>Cargando solicitudes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar solicitudes..."
            className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>{filtro || "TODOS"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleFilter("PENDIENTE")}>
              PENDIENTE
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilter("APROBADA")}>
              APROBADA
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilter("RECHAZADA")}>
              RECHAZADA
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilter("")}>
              TODOS
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {pendingRequests.length > 0 && (
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
                        onClick={() =>
                          handleOpenDetailsModal(
                            request.id_solicitud,
                            "APROBADA"
                          )
                        }
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() =>
                          handleOpenDetailsModal(
                            request.id_solicitud,
                            "RECHAZADA"
                          )
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
      )}

      {(resolvedRequests.length > 0 ||
        filtro === "APROBADA" ||
        filtro === "RECHAZADA") && (
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
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No hay solicitudes en el historial
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedSolicitudId && (
        <AutorizationDetailModal
          estado={actionType}
          id_solicitud={selectedSolicitudId}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          mensaje={
            actionType === "APROBADA"
              ? "¿Estás seguro que deseas aprobar esta solicitud?"
              : "¿Estás seguro que deseas rechazar esta solicitud?"
          }
        />
      )}
    </div>
  );
}
