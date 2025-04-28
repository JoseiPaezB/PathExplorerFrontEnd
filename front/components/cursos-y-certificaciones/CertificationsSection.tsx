import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/functions";
import { CertificationsUser } from "@/types/users";
import { Award, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function CertificationsSection({
  getFilteredCertifications,
}: {
  getFilteredCertifications: () => CertificationsUser[];
}) {
  return (
    <TabsContent value="certificaciones" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {getFilteredCertifications().map((cert, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{cert.Nombre}</CardTitle>
                  <CardDescription>{cert.Institucion}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={
                    cert.estado_validacion
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }
                >
                  {cert.estado_validacion ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Fecha de obtención:
                  </span>
                  <span className="font-medium">
                    {formatDate(cert.fecha_obtencion)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Válida hasta:</span>
                  <span className="font-medium">
                    {formatDate(cert.fecha_vencimiento || "")}
                  </span>
                </div>
              </div>
              <div className="space-y-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nivel:</span>
                <span className="font-medium">{cert.Nivel}</span>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 border-t pt-4">
              <Button variant="outline" className="gap-2">
                <Award className="h-4 w-4" />
                Ver credencial
              </Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <BookOpen className="h-4 w-4" />
                Renovar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
}

export default CertificationsSection;
