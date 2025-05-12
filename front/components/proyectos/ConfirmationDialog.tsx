import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserInfoBanca } from "@/types/projectsAdministration";
import SelectAdminDialog from "@/components/proyectos/SelectAdminDialog";
import { Administrator } from "@/types/requests";
import { SolicitudData } from "@/types/requests";

function ConfirmationDialog({
  showConfirmDialog,
  selectedEmployee,
  currentRole,
  currentProject,
  currentRoleId,
  closeAssignDialog,
  setShowConfirmDialog,
  setSelectedEmployee,
  onSuccess,
  createSolicitud,
  administrators,
}: {
  showConfirmDialog: boolean;
  selectedEmployee: UserInfoBanca | null;
  currentRole: string;
  currentProject: string;
  currentRoleId: number | undefined;
  closeAssignDialog: () => void;
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEmployee: React.Dispatch<
    React.SetStateAction<UserInfoBanca | null>
  >;
  onSuccess?: () => void;
  createSolicitud: (solicitudData: SolicitudData) => Promise<boolean>;
  administrators: Administrator[];
}) {
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const confirmAssignment = async () => {
    if (!selectedEmployee || !currentRoleId) {
      console.error("Missing data for assignment");
      closeConfirmDialog();
      return;
    }

    setShowAdminDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const closeAdminDialog = () => {
    setShowAdminDialog(false);
  };

  const closeAllDialogs = () => {
    setShowAdminDialog(false);
    setShowConfirmDialog(false);
    setSelectedEmployee(null);
    closeAssignDialog();
  };

  return (
    <>
      <Dialog open={showConfirmDialog} onOpenChange={closeConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar asignación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas asignar a{" "}
              {selectedEmployee
                ? selectedEmployee.nombre && selectedEmployee.apellido
                  ? `${selectedEmployee.nombre} ${selectedEmployee.apellido}`
                  : selectedEmployee.nombre_completo || "Sin nombre"
                : ""}{" "}
              al rol {currentRole} en el proyecto {currentProject}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={closeConfirmDialog}>
              Cancelar
            </Button>
            <Button onClick={confirmAssignment}>Continuar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SelectAdminDialog
        showAdminDialog={showAdminDialog}
        closeAdminDialog={closeAdminDialog}
        administrators={administrators}
        selectedEmployee={selectedEmployee}
        currentRole={currentRole}
        currentProject={currentProject}
        currentRoleId={currentRoleId}
        closeAllDialogs={closeAllDialogs}
        createSolicitud={createSolicitud}
        onSuccess={onSuccess}
      />
    </>
  );
}

export default ConfirmationDialog;
