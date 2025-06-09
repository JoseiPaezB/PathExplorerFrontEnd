"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteRole } from "@/hooks/useDeleteRole";

interface DeleteRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role: any;
  onSuccess: () => void;
}

export default function DeleteRoleDialog({
  isOpen,
  onClose,
  role,
  onSuccess,
}: DeleteRoleDialogProps) {
  const [deleteReason, setDeleteReason] = useState("");
  const { deleteRole, isDeleting } = useDeleteRole();

  const handleDelete = async () => {
    if (!role || !deleteReason.trim()) {
      alert("Por favor proporcione una razón para eliminar el rol");
      return;
    }

    try {
      const result = await deleteRole(role.id_rol, deleteReason);
      if (result.success) {
        setDeleteReason("");
        onSuccess();
        onClose();
      } else {
        alert("Error al eliminar el rol");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Error al eliminar el rol");
    }
  };

  const handleClose = () => {
    setDeleteReason("");
    onClose();
  };

  if (!role) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Eliminar Rol
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Por favor confirme que desea
            eliminar este rol.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <h4 className="font-medium">Información del Rol</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Título:</span> {role.titulo}
              </p>
              <p>
                <span className="font-medium">Proyecto:</span>{" "}
                {role.project?.nombre || "Sin proyecto"}
              </p>
              <p>
                <span className="font-medium">Nivel de experiencia:</span>{" "}
                {role.nivel_experiencia_requerido}
              </p>
              {role.descripcion && (
                <p className="mt-2">
                  <span className="font-medium">Descripción:</span>{" "}
                  {role.descripcion}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deleteReason">
              Razón para eliminar el rol <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="deleteReason"
              placeholder="Por favor explique por qué se está eliminando este rol..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={4}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Esta información se guardará para futuras referencias.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !deleteReason.trim()}
          >
            {isDeleting ? "Eliminando..." : "Eliminar Rol"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
