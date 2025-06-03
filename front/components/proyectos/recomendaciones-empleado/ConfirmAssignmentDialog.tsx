import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RecommendedRole } from "@/types/recommendations";

interface ConfirmAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRole: RecommendedRole | null;
  onConfirm: () => void;
}

export function ConfirmAssignmentDialog({
  open,
  onOpenChange,
  selectedRole,
  onConfirm,
}: ConfirmAssignmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            No
          </Button>
          <Button onClick={onConfirm}>Sí, continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}