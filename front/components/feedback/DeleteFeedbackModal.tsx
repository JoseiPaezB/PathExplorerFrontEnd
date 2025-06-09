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

interface DeleteFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleDelete: (id_evaluacion: number) => Promise<void>;
  isDeleting: boolean;
  id_evaluacion?: number;
}

function DeleteFeedbackModal({
  isOpen,
  onClose,
  handleDelete,
  isDeleting,
  id_evaluacion,
}: DeleteFeedbackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Eliminar Comentario
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Por favor confirme que desea
            eliminar este comentario.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <h4 className="font-medium">Deseas borrar esta evaluacion?</h4>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleDelete(id_evaluacion!)}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteFeedbackModal;
