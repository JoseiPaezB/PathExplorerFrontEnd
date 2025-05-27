"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Search, UserCog, AlertCircle } from "lucide-react";

import { useFetchRecommendedRoles } from "@/hooks/useFetchRecommendedRoles";
import { fetchGetAllAdministradores } from "@/hooks/fetchGetAllAdministradores";
import { useCreateSolicitud } from "@/hooks/useCreateSolicitud";

interface Skill {
  id_habilidad: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  nivel_minimo_requerido: number;
  importancia: string;
}

interface Manager {
  id_persona: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  estado: string;
}

interface Role {
  id_rol: number;
  titulo: string;
  descripcion: string;
  nivel_experiencia_requerido: string;
  id_proyecto: number;
  id_manager: number;
  skills?: Skill[];
  manager?: Manager[];
  project?: Project[];
}

interface RecommendedRole {
  id_rol: number;
  titulo: string;
  descripcion: string;
  compatibilidad: number;
  roleWithProject: Role;
}

interface Administrator {
  id_administrador: number;
  nombre_completo: string;
  departamento: string;
  nivel_acceso: number;
}

interface SolicitudData {
  id_administrador: number;
  id_manager: number;
  id_empleado: number;
  id_rol: number;
  fecha_solicitud: string;
  justificacion: string;
  urgencia: number;
  estado: string;
  comentarios_resolucion: string;
  fecha_resolucion: null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

function Page() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Estados para los filtros de selección
  const [projectStates] = useState<string[]>([
    "PLANIFICACION",
    "EN_PROGRESO",
    "FINALIZADO",
    "PAUSADO",
  ]);

  const [skillCategories] = useState<string[]>([
    "TECNICA",
    "BLANDA",
    "LIDERAZGO",
    "GESTION",
    "DOMINIO",
  ]);

  // Estados para los diálogos y solicitudes
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RecommendedRole | null>(
    null
  );
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [urgencia, setUrgencia] = useState(1);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  const {
    recommendedRoles,
    isLoading: isLoadingRoles,
    error: rolesError,
    fetchRecommendedRoles,
    filters: rolesFilters,
  } = useFetchRecommendedRoles();

  const { administrador: administrators, isLoading: isLoadingAdmins } =
    fetchGetAllAdministradores();
  const {
    createSolicitud,
    isLoading: isSubmitting,
    error: solicitudError,
  } = useCreateSolicitud();

  const applyRolesFilters = (key: string, value: string) => {
    const newFilters = { ...rolesFilters, [key]: value };
    fetchRecommendedRoles(newFilters);
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

  const handleConfirmAssignment = () => {
    setShowConfirmDialog(false);
    setShowAdminDialog(true);
  };

  const closeAllDialogs = () => {
    setShowConfirmDialog(false);
    setShowAdminDialog(false);
    setSelectedRole(null);
    setSelectedAdmin(null);
    setSearchTerm("");
    setJustificacion("");
    setUrgencia(1);
  };

  const filteredAdministrators = administrators.filter(
    (admin) =>
      admin.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitRequest = async () => {
    if (!selectedRole || !selectedAdmin) {
      toast({
        title: "Error",
        description: "Faltan datos necesarios para crear la solicitud",
        variant: "destructive",
      });
      return;
    }

    if (!justificacion.trim()) {
      toast({
        title: "Error",
        description: "La justificación es obligatoria",
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
      id_administrador: selectedAdmin.id_administrador,
      id_manager: selectedRole.roleWithProject?.manager?.[0]?.id_persona || 0,
      id_empleado: currentUserId,
      id_rol: selectedRole.id_rol,
      fecha_solicitud: new Date().toISOString(),
      justificacion: justificacion,
      urgencia: urgencia,
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
      setHasPendingRequest(true);
      closeAllDialogs();
    } else {
      toast({
        title: "Error",
        description: solicitudError || "Error al enviar la solicitud",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Roles Recomendados
        </h1>
        <p className="text-muted-foreground">
          Descubre posiciones que se alinean con tus habilidades y experiencia
        </p>
      </div>

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
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={rolesFilters.roleState || "todos"}
                onValueChange={(value: string) => {
                  const filterValue = value === "todos" ? "" : value;
                  applyRolesFilters("roleState", filterValue);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado del proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  {projectStates.map((state: string) => (
                    <SelectItem key={state} value={state}>
                      {state.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={rolesFilters.roleSkills || "todas"}
                onValueChange={(value: string) => {
                  const filterValue = value === "todas" ? "" : value;
                  applyRolesFilters("roleSkills", filterValue);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría de habilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {skillCategories.map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                onClick={() => fetchRecommendedRoles()}
                variant="outline"
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          ) : recommendedRoles && recommendedRoles.length > 0 ? (
            <div className="space-y-6">
              {recommendedRoles.map((role: RecommendedRole, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">
                          {role.roleWithProject?.titulo || "Rol sin título"}
                        </h3>
                        <Badge
                          variant={
                            role.roleWithProject?.project?.[0]?.estado ===
                            "EN_PROGRESO"
                              ? "default"
                              : "outline"
                          }
                        >
                          {role.roleWithProject?.project?.[0]?.estado?.replace(
                            "_",
                            " "
                          ) || "Estado desconocido"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {role.roleWithProject?.descripcion}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Compatibilidad: {role.compatibilidad || 85}%
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Proyecto:</p>
                      <p className="text-sm">
                        {role.roleWithProject?.project?.[0]?.nombre ||
                          "Sin proyecto asignado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Manager:</p>
                      <p className="text-sm">
                        {role.roleWithProject?.manager?.[0]?.nombre
                          ? `${role.roleWithProject.manager[0].nombre} ${role.roleWithProject.manager[0].apellido}`
                          : "Sin manager asignado"}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <p className="text-sm font-medium mb-2">
                      Habilidades requeridas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {role.roleWithProject?.skills
                        ?.slice(0, 5)
                        .map((skill: Skill, idx: number) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-slate-50"
                          >
                            {skill.nombre}{" "}
                            {skill.nivel_minimo_requerido
                              ? `(Nivel ${skill.nivel_minimo_requerido})`
                              : ""}
                          </Badge>
                        ))}
                      {(role.roleWithProject?.skills?.length || 0) > 5 && (
                        <Badge variant="outline">
                          +{(role.roleWithProject?.skills?.length || 0) - 5} más
                        </Badge>
                      )}
                      {(!role.roleWithProject?.skills ||
                        role.roleWithProject.skills.length === 0) && (
                        <span className="text-sm text-gray-400">
                          No hay habilidades especificadas
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Función en desarrollo",
                          description:
                            "La función para ver detalles estará disponible próximamente.",
                          variant: "default",
                        });
                      }}
                    >
                      Ver detalles
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAssignRole(role)}
                      disabled={hasPendingRequest}
                    >
                      Asignar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No hay roles recomendados disponibles.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Esto puede deberse a los filtros aplicados o a que no hay roles
                abiertos que coincidan con tu perfil.
              </p>
              <Button
                onClick={() => fetchRecommendedRoles({})}
                variant="outline"
                className="mt-4"
              >
                Quitar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar solicitud de asignación</DialogTitle>
            <DialogDescription>
              ¿Deseas solicitar el puesto de{" "}
              <strong>{selectedRole?.roleWithProject?.titulo}</strong> para el
              proyecto{" "}
              <strong>
                {selectedRole?.roleWithProject?.project?.[0]?.nombre}
              </strong>{" "}
              con el manager{" "}
              <strong>
                {selectedRole?.roleWithProject?.manager?.[0]?.nombre
                  ? `${selectedRole.roleWithProject.manager[0].nombre} ${selectedRole.roleWithProject.manager[0].apellido}`
                  : "Sin manager asignado"}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              No
            </Button>
            <Button onClick={handleConfirmAssignment}>Sí, continuar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de selección de administrador */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Seleccionar administrador para aprobación</DialogTitle>
            <DialogDescription>
              Elige un administrador para que apruebe tu solicitud de asignación
              al rol <strong>{selectedRole?.roleWithProject?.titulo}</strong> en
              el proyecto{" "}
              <strong>
                {selectedRole?.roleWithProject?.project?.[0]?.nombre}
              </strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar administradores..."
                className="w-full rounded-md border border-input bg-white pl-8 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto">
              {isLoadingAdmins ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse">
                    Cargando administradores...
                  </div>
                </div>
              ) : filteredAdministrators.length > 0 ? (
                filteredAdministrators.map((admin) => {
                  const iniciales = admin.nombre_completo
                    .split(" ")
                    .map((parte) => parte[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <div
                      key={admin.id_administrador}
                      className={`mb-2 rounded-md border p-3 hover:bg-muted cursor-pointer ${
                        selectedAdmin?.id_administrador ===
                        admin.id_administrador
                          ? "bg-muted border-primary"
                          : ""
                      }`}
                      onClick={() => setSelectedAdmin(admin)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{iniciales}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">
                              {admin.nombre_completo}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {admin.departamento}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700"
                          >
                            Nivel {admin.nivel_acceso}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <UserCog className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    No hay administradores disponibles
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No se encontraron administradores que coincidan con la
                    búsqueda.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="justificacion" className="text-sm font-medium">
                  Justificación
                </Label>
                <textarea
                  id="justificacion"
                  className="mt-1 w-full rounded-md border border-input p-2 text-sm"
                  rows={3}
                  placeholder="Explica por qué deberías ser asignado a este rol..."
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="urgencia" className="text-sm font-medium">
                  Nivel de urgencia
                </Label>
                <div className="mt-1 flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`h-8 w-8 rounded-full ${
                        urgencia === level
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                      onClick={() => setUrgencia(level)}
                    >
                      {level}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {urgencia === 1
                      ? "Baja"
                      : urgencia === 2
                      ? "Media-baja"
                      : urgencia === 3
                      ? "Media"
                      : urgencia === 4
                      ? "Media-alta"
                      : "Alta"}
                  </span>
                </div>
              </div>
            </div>

            {solicitudError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {solicitudError}
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={closeAllDialogs}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={!selectedAdmin || isSubmitting || !justificacion.trim()}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                "Enviar solicitud"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page;
