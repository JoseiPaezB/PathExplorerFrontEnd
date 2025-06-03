"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

import { useFetchRecommendedRoles } from "@/hooks/useFetchRecommendedRoles";
import { fetchGetAllAdministradores } from "@/hooks/fetchGetAllAdministradores";
import { useCreateSolicitud } from "@/hooks/useCreateSolicitud";
import { useHasPendingRequest } from "@/hooks/useHasPendingRequest";

import { RoleCard } from "@/components/proyectos/recomendaciones-empleado/RoleCard";
import { ConfirmAssignmentDialog } from "@/components/proyectos/recomendaciones-empleado/ConfirmAssignmentDialog";
import { AdminSelectionDialog } from "@/components/proyectos/recomendaciones-empleado/AdminSelectionDialog";
import { ProjectDetailsDialog } from "@/components/proyectos/recomendaciones-empleado/ProjectDetailsDialog";
import { SkillsFilter } from "@/components/proyectos/recomendaciones-empleado/SkillsFilter";

import { RecommendedRole, SolicitudData } from "@/types/recommendations";

interface RecommendationsComponentProps {
  onRequestCreated?: () => void; // Callback para actualizar estado del padre
}

export function RecommendationsComponent({ onRequestCreated }: RecommendationsComponentProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RecommendedRole | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  const {
    hasPendingRequest,
    isLoading: isLoadingPending,
    refreshPendingStatus,
  } = useHasPendingRequest();

  const {
    recommendedRoles,
    isLoading: isLoadingRoles,
    error: rolesError,
    fetchRecommendedRoles,
  } = useFetchRecommendedRoles();

  const { administrador: administrators, isLoading: isLoadingAdmins } =
    fetchGetAllAdministradores();
  
  const {
    createSolicitud,
    isLoading: isSubmitting,
    error: solicitudError,
  } = useCreateSolicitud();

  // Cargar recomendaciones al montar el componente
  useEffect(() => {
    if (!isLoadingPending) {
      fetchRecommendedRoles({});
    }
  }, [isLoadingPending, fetchRecommendedRoles]);

  const handleSkillFilter = (skill: string) => {
    setSelectedSkill(skill);
    const filters = skill ? { roleSkills: skill } : {};
    fetchRecommendedRoles(filters);
  };

  const handleAssignRole = (role: RecommendedRole) => {
    if (hasPendingRequest) {
      toast({
        title: "Solicitud pendiente",
        description:
          "Ya tienes una solicitud pendiente. Debes esperar a que sea procesada antes de enviar otra.",
        variant: "destructive",
      });
      return;
    }

    setSelectedRole(role);
    setShowConfirmDialog(true);
  };

  const handleViewDetails = (role: RecommendedRole) => {
    setSelectedRole(role);
    setShowProjectDialog(true);
  };

  const handleConfirmAssignment = () => {
    setShowConfirmDialog(false);
    setShowAdminDialog(true);
  };

  const closeAllDialogs = () => {
    setShowConfirmDialog(false);
    setShowAdminDialog(false);
    setShowProjectDialog(false);
    setSelectedRole(null);
  };

  const handleSubmitRequest = async (data: {
    selectedAdmin: any;
    justificacion: string;
    urgencia: number;
  }) => {
    if (!selectedRole || !data.selectedAdmin) {
      toast({
        title: "Error",
        description: "Faltan datos necesarios para crear la solicitud",
        variant: "destructive",
      });
      return;
    }

    const currentUserId = user?.id_persona;

    if (!currentUserId) {
      toast({
        title: "Error",
        description: "No se pudo obtener la información del usuario",
        variant: "destructive",
      });
      return;
    }

    const solicitudData: SolicitudData = {
      id_administrador: data.selectedAdmin.id_administrador,
      id_manager: selectedRole.roleWithProject?.manager?.[0]?.id_persona || 0,
      id_empleado: currentUserId,
      id_rol: selectedRole.id_rol,
      fecha_solicitud: new Date().toISOString(),
      justificacion: data.justificacion,
      urgencia: data.urgencia,
      estado: "PENDIENTE",
      comentarios_resolucion: "",
      fecha_resolucion: null,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString(),
    };

    const success = await createSolicitud(solicitudData);

    if (success) {
      toast({
        title: "Solicitud enviada",
        description: `Tu solicitud para el rol "${selectedRole.roleWithProject?.titulo}" ha sido enviada exitosamente.`,
        variant: "default",
      });
      
      // Actualizar estado de solicitud pendiente
      refreshPendingStatus();
      
      // Notificar al componente padre si existe callback
      if (onRequestCreated) {
        onRequestCreated();
      }
      
      closeAllDialogs();
    } else {
      toast({
        title: "Error",
        description: solicitudError || "Error al enviar la solicitud",
        variant: "destructive",
      });
    }
  };

  if (isLoadingPending) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <div className="animate-pulse">
              Verificando estado de solicitudes...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {hasPendingRequest && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <p className="text-orange-800 font-medium">
                Tienes una solicitud pendiente. No puedes enviar otra hasta que
                sea procesada.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Roles Recomendados</CardTitle>
              <CardDescription>
                Posiciones que se alinean con tus habilidades y experiencia
              </CardDescription>
            </div>
            <SkillsFilter
              selectedSkill={selectedSkill}
              onSkillChange={handleSkillFilter}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingRoles ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : rolesError ? (
            <div className="text-red-500">
              <p>Error al cargar roles recomendados: {rolesError}</p>
              <Button
                onClick={() => fetchRecommendedRoles({})}
                variant="outline"
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          ) : recommendedRoles && recommendedRoles.length > 0 ? (
            <div className="space-y-6">
              {recommendedRoles.map((role: RecommendedRole, index: number) => (
                <RoleCard
                  key={index}
                  role={role}
                  onAssignRole={handleAssignRole}
                  onViewDetails={handleViewDetails}
                  hasPendingRequest={hasPendingRequest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No hay roles recomendados disponibles.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {selectedSkill 
                  ? `No se encontraron roles para la habilidad "${selectedSkill}".`
                  : "No hay roles abiertos que coincidan con tu perfil."
                }
              </p>
              <Button
                onClick={() => {
                  setSelectedSkill("");
                  fetchRecommendedRoles({});
                }}
                variant="outline"
                className="mt-4"
              >
                {selectedSkill ? "Quitar filtro" : "Recargar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmAssignmentDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        selectedRole={selectedRole}
        onConfirm={handleConfirmAssignment}
      />

      <AdminSelectionDialog
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
        selectedRole={selectedRole}
        administrators={administrators}
        isLoadingAdmins={isLoadingAdmins}
        onSubmit={handleSubmitRequest}
        onCancel={closeAllDialogs}
        isSubmitting={isSubmitting}
        solicitudError={solicitudError}
      />

      <ProjectDetailsDialog
        open={showProjectDialog}
        onOpenChange={setShowProjectDialog}
        selectedRole={selectedRole}
        onClose={closeAllDialogs}
      />
    </div>
  );
}