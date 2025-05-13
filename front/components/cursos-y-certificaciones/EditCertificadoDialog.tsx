import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CertificationsUser, CertificationFormData } from "@/types/users";
import { useToast } from "@/components/ui/use-toast";
import { useEditUserCertification } from "@/hooks/useEditUserCertification";

interface EditCertificationDialogProps {
  certification: CertificationsUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulUpdate: () => void;
}

export function EditCertificationDialog({
  certification,
  isOpen,
  onClose,
  onSuccessfulUpdate,
}: EditCertificationDialogProps) {
  console.log("Certification to edit:", certification);
  
  const [formData, setFormData] = useState<CertificationFormData>({
    id_certificacion: certification.ID_Certificacion,
    fecha_obtencion: formatDateForInput(certification.fecha_obtencion),
    fecha_vencimiento: formatDateForInput(certification.fecha_vencimiento || ""),
    estado_validacion: certification.estado_validacion,
    fecha_creacion: certification.fecha_creacion || new Date().toISOString()
  });
  
  const { editCertification, isLoading, error } = useEditUserCertification();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the data to match the format that worked in Postman
    const formattedData = {
      ...formData,
      id_certificacion: Number(formData.id_certificacion), // Ensure this is a number, not a string
      estado_validacion: Boolean(formData.estado_validacion) // Ensure this is a boolean
    };
    
    console.log("Submitting formatted data:", formattedData);
    
    try {
      const result = await editCertification(formattedData);
      
      if (result.success) {
        toast({
          title: "Certificación actualizada",
          description: "Los datos se actualizaron correctamente",
        });
        onSuccessfulUpdate();
        onClose();
      } else {
        throw new Error(result.message || "Error al actualizar");
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      toast({
        title: "Error",
        description: error || "No se pudo actualizar la certificación",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Renovar certificación</DialogTitle>
            <DialogDescription>
              Actualiza los datos de tu certificación {certification.Nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha_obtencion" className="text-right">
                Fecha de obtención
              </Label>
              <Input
                id="fecha_obtencion"
                name="fecha_obtencion"
                type="date"
                value={formData.fecha_obtencion}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha_vencimiento" className="text-right">
                Fecha de vencimiento
              </Label>
              <Input
                id="fecha_vencimiento"
                name="fecha_vencimiento"
                type="date"
                value={formData.fecha_vencimiento}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to format dates for input fields
function formatDateForInput(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
}