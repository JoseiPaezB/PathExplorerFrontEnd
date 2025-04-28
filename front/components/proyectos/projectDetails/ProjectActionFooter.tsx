"use client";

import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProjectActionFooterProps {
  isEditMode: boolean;
  onSave: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  onClose: () => void;
}

export default function ProjectActionFooter({
  isEditMode,
  onSave,
  onCancel,
  onClose,
}: ProjectActionFooterProps) {
  return (
    <DialogFooter className="pt-2">
      {isEditMode ? (
        <>
          <Button onClick={onSave} size="sm">
            Guardar Cambios
          </Button>
          <Button onClick={onCancel} size="sm" variant="outline">
            Cancelar
          </Button>
        </>
      ) : (
        <Button onClick={onClose} size="sm">
          Cerrar
        </Button>
      )}
    </DialogFooter>
  );
}
