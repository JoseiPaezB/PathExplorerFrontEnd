"use client";
import { useState, useEffect } from "react";
import { useFetchSolicitudesDeAutorizacion } from "@/hooks/fetchSolicitudesDeAutorizacion";
import { useAssignmentRequestForm } from "@/hooks/useAssignmentRequestForm";
import { Request } from "@/types/requests";
import AutorizationDetailModal from "@/components/solicitudes/AutorizationDetail";
import SolicitudesHeader from "@/components/solicitudes/SolicitudesHeader";
import PendingSolicitudesSection from "@/components/solicitudes/PendingSolicitudesSection";
import CompletedSolicitudesSection from "@/components/solicitudes/CompletedSolicitudesSection";

export default function AutorizacionesPage() {
  const { solicitudes, isLoading, error, refetch } =
    useFetchSolicitudesDeAutorizacion();
  const { updateAssignmentRequestForm } = useAssignmentRequestForm();
  const [filtro, setFiltro] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Request[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState<number | null>(
    null
  );
  const [actionType, setActionType] = useState<string>("");

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
    try {
      await updateAssignmentRequestForm(
        id_solicitud,
        estado,
        comentarios_resolucion
      );
      setIsDetailsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating assignment request:", error);
    }
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
      <SolicitudesHeader
        setFiltro={setFiltro}
        setSearchTerm={setSearchTerm}
        filtro={filtro}
        searchTerm={searchTerm}
      />

      {pendingRequests.length > 0 && (
        <PendingSolicitudesSection
          pendingRequests={pendingRequests}
          handleOpenDetailsModal={handleOpenDetailsModal}
        />
      )}

      {(resolvedRequests.length > 0 ||
        filtro === "APROBADA" ||
        filtro === "RECHAZADA") && (
        <CompletedSolicitudesSection resolvedRequests={resolvedRequests} />
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
