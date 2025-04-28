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
import { Search, User } from "lucide-react";
import { useMemo } from "react";
import { UserInfoBanca } from "@/types/projectsAdministration";

function AssignEmployeeDialog({
  showAssignDialog,
  closeAssignDialog,
  currentProject,
  currentRole,
  loadingCandidates,
  empleadosBanca,
  candidateSearchTerm,
  setCandidateSearchTerm,
  setSelectedEmployee,
  setShowConfirmDialog,
}: {
  showAssignDialog: boolean;
  closeAssignDialog: () => void;
  currentProject: string;
  currentRole: string;
  loadingCandidates: boolean;
  empleadosBanca: UserInfoBanca[];
  candidateSearchTerm: string;
  setCandidateSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setSelectedEmployee: React.Dispatch<
    React.SetStateAction<UserInfoBanca | null>
  >;
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const filteredEmpleados = useMemo(() => {
    return empleadosBanca.filter((empleado) => {
      const nombreCompleto =
        empleado.nombre_completo ||
        `${empleado.nombre || ""} ${empleado.apellido || ""}`;
      const puesto = empleado.puesto_actual || "";

      return (
        nombreCompleto
          .toLowerCase()
          .includes(candidateSearchTerm.toLowerCase()) ||
        puesto.toLowerCase().includes(candidateSearchTerm.toLowerCase())
      );
    });
  }, [empleadosBanca, candidateSearchTerm]);

  const assignEmployee = (empleado: UserInfoBanca) => {
    setSelectedEmployee(empleado);
    setShowConfirmDialog(true);
  };

  return (
    <Dialog open={showAssignDialog} onOpenChange={closeAssignDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Asignar empleado a rol</DialogTitle>
          <DialogDescription>
            Selecciona un empleado para el rol {currentRole} en el proyecto{" "}
            {currentProject}
          </DialogDescription>
        </DialogHeader>

        {loadingCandidates ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <p className="mt-2 text-sm text-muted-foreground">
                Cargando empleados disponibles...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar empleados..."
                className="w-full rounded-md border border-input bg-white pl-8 text-sm"
                value={candidateSearchTerm}
                onChange={(e) => setCandidateSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {filteredEmpleados.length > 0 ? (
                filteredEmpleados
                  .sort((a, b) => {
                    const matchA = a.porcentaje_match
                      ? parseFloat(String(a.porcentaje_match).replace("%", ""))
                      : 0;
                    const matchB = b.porcentaje_match
                      ? parseFloat(String(b.porcentaje_match).replace("%", ""))
                      : 0;
                    return matchB - matchA;
                  })
                  .map((empleado) => {
                    const nombreEmpleado =
                      empleado.nombre_completo ||
                      `${empleado.nombre || ""} ${empleado.apellido || ""}`;
                    const iniciales = nombreEmpleado
                      .split(" ")
                      .map((parte) => parte[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={empleado.id_empleado}
                        className="mb-2 rounded-md border p-3 hover:bg-muted cursor-pointer"
                        onClick={() => assignEmployee(empleado)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{iniciales}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{nombreEmpleado}</h4>
                              <p className="text-sm text-muted-foreground">
                                {empleado.puesto_actual || "Sin puesto"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="outline"
                              className={
                                empleado.porcentaje_match &&
                                parseFloat(
                                  String(empleado.porcentaje_match).replace(
                                    "%",
                                    ""
                                  )
                                ) >= 80
                                  ? "bg-green-50 text-green-700"
                                  : empleado.porcentaje_match &&
                                    parseFloat(
                                      String(empleado.porcentaje_match).replace(
                                        "%",
                                        ""
                                      )
                                    ) >= 70
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-yellow-50 text-yellow-700"
                              }
                            >
                              {empleado.porcentaje_match || "0%"}
                            </Badge>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Disponibilidad:{" "}
                              {empleado.porcentaje_disponibilidad || "0%"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <User className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    No hay empleados disponibles
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No se encontraron empleados que coincidan con la búsqueda.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={closeAssignDialog}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignEmployeeDialog;
