import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { ProfessionalHistory } from "@/types/users";

function ProfessionalHistorySection({
  isLoading,
  error,
  professionalHistory,
}: {
  isLoading: boolean;
  error: string | null;
  professionalHistory: ProfessionalHistory | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Historial Profesional
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-16">
          {" "}
          {isLoading ? (
            <p>Cargando historial profesional...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : professionalHistory &&
            professionalHistory.professionalHistory.length > 0 ? (
            professionalHistory.professionalHistory.map((entry, index) => (
              <div
                key={index}
                className="relative border-l border-muted pl-6 pb-8"
              >
                {" "}
                <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
                <div className="space-y-4">
                  {" "}
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <h4 className="font-medium">
                      {entry.role || "Posición no especificada"}
                    </h4>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    {entry.nombre} {entry.apellido}
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {entry.historial}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No hay historial profesional disponible</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfessionalHistorySection;
