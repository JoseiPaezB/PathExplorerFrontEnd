import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserCog } from "lucide-react";
import { useState, useMemo } from "react";
import { SolicitudData } from "@/types/requests";
import { UserInfoBanca } from "@/types/projectsAdministration";
import { Administrator } from "@/types/requests";

function SelectAdminDialog({
  showAdminDialog,
  closeAdminDialog,
  administrators,
  selectedEmployee,
  currentRole,
  currentProject,
  currentRoleId,
  closeAllDialogs,
  createSolicitud,
  onSuccess,
}: {
  showAdminDialog: boolean;
  closeAdminDialog: () => void;
  administrators: Administrator[];
  selectedEmployee: UserInfoBanca | null;
  currentRole: string;
  currentProject: string;
  currentRoleId: number | undefined;
  closeAllDialogs: () => void;
  createSolicitud: (solicitudData: SolicitudData) => Promise<boolean>;
  onSuccess?: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(
    null
  );
  const [justificacion, setJustificacion] = useState("");
  const [urgencia, setUrgencia] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredAdministrators = useMemo(() => {
    return administrators.filter(
      (admin) =>
        admin.nombre_completo
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        admin.departamento.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [administrators, searchTerm]);

  const selectAdmin = (admin: Administrator) => {
    setSelectedAdmin(admin);
  };

  const submitRequest = async () => {
    if (!selectedEmployee || !currentRoleId || !selectedAdmin) {
      setError("Faltan datos necesarios para crear la solicitud");
      return;
    }

    if (!justificacion.trim()) {
      setError("La justificación es obligatoria");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const solicitudData: SolicitudData = {
        id_administrador: selectedAdmin.id_administrador,
        id_empleado: selectedEmployee.id_empleado || 0,
        id_rol: currentRoleId,
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
      if (!success) {
        setError("Error al crear la solicitud de asignación");
        setIsSubmitting(false);
        return;
      }

      closeAllDialogs();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating assignment request:", error);
      setError("Error al procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showAdminDialog} onOpenChange={closeAdminDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Seleccionar administrador para aprobación</DialogTitle>
          <DialogDescription>
            Elige un administrador para que apruebe la asignación de{" "}
            {selectedEmployee
              ? selectedEmployee.nombre_completo ||
                `${selectedEmployee.nombre || ""} ${
                  selectedEmployee.apellido || ""
                }`
              : ""}{" "}
            al rol {currentRole} en el proyecto {currentProject}
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
            {filteredAdministrators.length > 0 ? (
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
                      selectedAdmin?.id_administrador === admin.id_administrador
                        ? "bg-muted border-primary"
                        : ""
                    }`}
                    onClick={() => selectAdmin(admin)}
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
              <label htmlFor="justificacion" className="text-sm font-medium">
                Justificación
              </label>
              <textarea
                id="justificacion"
                className="mt-1 w-full rounded-md border border-input p-2 text-sm"
                rows={3}
                placeholder="Explica por qué deseas asignar este empleado a este rol..."
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="urgencia" className="text-sm font-medium">
                Nivel de urgencia
              </label>
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={closeAdminDialog}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={submitRequest}
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
  );
}

export default SelectAdminDialog;
