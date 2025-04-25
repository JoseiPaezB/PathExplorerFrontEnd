import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProjectDetailsModalProps {
  estado: string;
  id_solicitud: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    id_solicitud: number,
    estado: string,
    comentarios_resolucion: string
  ) => void;
  mensaje: string;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  estado,
  id_solicitud,
  isOpen,
  onClose,
  onSubmit,
  mensaje,
}) => {
  const [comentarios, setComentarios] = useState<string>("");
  const handleSubmit = () => {
    onSubmit(id_solicitud, estado, comentarios);
    setComentarios("");
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Detalles de la solicitud
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mensaje">Mensaje</Label>
              <p className="text-sm text-gray-700">{mensaje}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentarios">Comentarios de resolución</Label>
              <Textarea
                id="comentarios"
                placeholder="Ingrese sus comentarios aquí..."
                className="min-h-20"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                required
              />
            </div>
          </form>
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className={
              estado === "APROBADA"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
          >
            {estado === "APROBADA" ? "Aprobar" : "Rechazar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
