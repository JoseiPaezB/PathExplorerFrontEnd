"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Calendar,
  MapPin,
  Building,
  Trophy,
  Users,
} from "lucide-react";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import type { ProfessionalHistory } from "@/types/users";

interface ProfessionalHistorySectionProps {
  professionalHistory: ProfessionalHistory | null;
  isLoading?: boolean;
  error: string | null;
}

export default function ProfessionalHistorySection({
  professionalHistory,
  isLoading,
  error,
}: ProfessionalHistorySectionProps) {
  const renderHistorialProfesional = (historial: string) => {
    try {
      const data = JSON.parse(historial);

      return (
        <div>
          {/* Experiencia Laboral */}
          {data.experiencia_laboral && data.experiencia_laboral.length > 0 && (
            <div>
              <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experiencia Laboral ({data.experiencia_laboral.length})
              </h4>

              <div className="space-y-4">
                {data.experiencia_laboral.map((exp: any, index: number) => (
                  <div
                    key={index}
                    className="border border-purple-100 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="space-y-3">
                      {/* Header del trabajo */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h5 className="font-semibold text-purple-900">
                            {exp.cargo}
                          </h5>
                          <div className="flex items-center gap-2 text-sm text-purple-700">
                            <Building className="h-3 w-3" />
                            <span>{exp.empresa}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            {exp.fecha_inicio} - {exp.fecha_fin || "Actualidad"}
                          </Badge>
                          {exp.ubicacion && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              {exp.ubicacion}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Descripción */}
                      {exp.descripcion && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {exp.descripcion}
                        </p>
                      )}

                      {/* Logros */}
                      {exp.logros && exp.logros.length > 0 && (
                        <div>
                          <h6 className="font-medium text-purple-800 text-sm mb-2 flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            Logros Principales:
                          </h6>
                          <ul className="space-y-1">
                            {exp.logros.map(
                              (logro: string, logroIndex: number) => (
                                <li
                                  key={logroIndex}
                                  className="text-sm text-gray-600 flex items-start gap-2"
                                >
                                  <span className="text-purple-500 mt-1.5 flex-shrink-0">
                                    •
                                  </span>
                                  <span className="leading-relaxed">
                                    {logro}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } catch (e) {
      // Si no es JSON válido, mostrar como texto plano con formato
      return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
            {historial}
          </pre>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Historial Profesional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner
              size="md"
              color="primary"
              text="Cargando historial profesional..."
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Historial Profesional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Briefcase className="h-5 w-5 text-purple-600" />
          Historial Profesional
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {professionalHistory?.professionalHistory &&
        professionalHistory.professionalHistory.length > 0 ? (
          <div className="space-y-6">
            {professionalHistory.professionalHistory.map((person, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-purple-700 font-medium">
                  <Users className="h-4 w-4" />
                  <span>
                    {person.nombre} {person.apellido}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {person.role}
                  </Badge>
                </div>

                {person.historial &&
                  renderHistorialProfesional(person.historial)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No hay historial profesional registrado
            </p>
            <p className="text-xs text-gray-400 mt-1">
              El historial profesional aparecerá aquí cuando se agregue
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
