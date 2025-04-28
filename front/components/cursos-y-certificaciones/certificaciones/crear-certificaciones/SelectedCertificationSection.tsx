import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Certification } from "@/types/certifications";

function SelectedCertificationSection({
  selectedCertification,
}: {
  selectedCertification: Certification;
}) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Certificacion</Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            value={selectedCertification.nombre}
            className="h-10"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="institucion">Institución</Label>
          <Input
            id="institucion"
            name="institucion"
            type="text"
            value={selectedCertification.institucion}
            className="h-10"
            disabled
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nivel">Nivel</Label>
          <Input
            id="nivel"
            name="nivel"
            type="text"
            value={selectedCertification.nivel}
            className="h-10"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="validez">Validez</Label>
          <Input
            id="validez"
            name="validez"
            type="text"
            value={selectedCertification.validez}
            className="h-10"
            disabled
          />
        </div>
      </div>
    </>
  );
}

export default SelectedCertificationSection;
