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

      const makeFirstSentenceBold = (text: string) => {
        if (!text) return text;
       
        return text.split(/\n/).map(line => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return line;
         
          const firstSentenceMatch = trimmedLine.match(/^([^.!?]*[.!?])/);
          
          if (firstSentenceMatch) {
            const firstSentence = firstSentenceMatch[1];
            const rest = trimmedLine.substring(firstSentence.length);
            return `<span class="font-bold text-primary">${firstSentence}</span>${rest}`;
          } else {
            if (trimmedLine.length <= 60) {
              return `<span class="font-bold text-primary">${trimmedLine}</span>`;
            } else {
              const cutIndex = trimmedLine.lastIndexOf(' ', 60);
              const firstPart = trimmedLine.substring(0, cutIndex > 0 ? cutIndex : 60);
              const rest = trimmedLine.substring(firstPart.length);
              return `<span class="font-bold text-primary">${firstPart}</span>${rest}`;
            }
          }
        }).join('\n');
      };

      return (
        <div className="space-y-6">
          {data.resumen_profesional && (
            <div className="bg-primary/10 rounded-xl p-5 border border-primary/20">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Resumen Profesional
              </h4>
              <div 
                className="text-foreground text-sm leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: makeFirstSentenceBold(data.resumen_profesional) }}
              />
            </div>
          )}
          {data.experiencia_laboral && data.experiencia_laboral.length > 0 && (
            <div>
              <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experiencia Laboral (<span className="font-bold">{data.experiencia_laboral.length}</span>)
              </h4>

              <div className="space-y-4">
                {data.experiencia_laboral.map((exp: any, index: number) => (
                  <div
                    key={index}
                    className="border border-border rounded-xl p-5 bg-card hover:shadow-lg transition-all duration-200 hover:border-primary/30"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <h5 className="font-semibold text-foreground text-lg">
                            {exp.cargo}
                          </h5>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Building className="h-4 w-4" />
                            <span>{exp.empresa}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-colors"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span className="font-bold">{exp.fecha_inicio}</span> - <span className="font-bold">{exp.fecha_fin || "Actualidad"}</span>
                          </Badge>
                          {exp.ubicacion && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-accent/30 text-foreground border-accent hover:bg-accent/50 transition-colors"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              {exp.ubicacion}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {exp.descripcion && (
                        <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                          <div 
                            className="text-sm text-foreground leading-relaxed whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: makeFirstSentenceBold(exp.descripcion) }}
                          />
                        </div>
                      )}
                      {exp.logros && exp.logros.length > 0 && (
                        <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                          <h6 className="font-medium text-success text-sm mb-3 flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            Logros Principales (<span className="font-bold">{exp.logros.length}</span>):
                          </h6>
                          <ul className="space-y-2">
                            {exp.logros.map(
                              (logro: string, logroIndex: number) => (
                                <li
                                  key={logroIndex}
                                  className="text-sm text-foreground flex items-start gap-3"
                                >
                                  <span className="text-success mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-success"></span>
                                  <span 
                                    className="leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: makeFirstSentenceBold(logro) }}
                                  />
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
      const makeFirstSentenceBoldPlainText = (text: string) => {
        return text.split(/\n/).map(line => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return line;
          
          const firstSentenceMatch = trimmedLine.match(/^([^.!?]*[.!?])/);
          
          if (firstSentenceMatch) {
            const firstSentence = firstSentenceMatch[1];
            const rest = trimmedLine.substring(firstSentence.length);
            return `<span class="font-bold text-primary">${firstSentence}</span>${rest}`;
          } else {
            if (trimmedLine.length <= 60) {
              return `<span class="font-bold text-primary">${trimmedLine}</span>`;
            } else {
              const cutIndex = trimmedLine.lastIndexOf(' ', 60);
              const firstPart = trimmedLine.substring(0, cutIndex > 0 ? cutIndex : 60);
              const rest = trimmedLine.substring(firstPart.length);
              return `<span class="font-bold text-primary">${firstPart}</span>${rest}`;
            }
          }
        }).join('\n');
      };

      return (
        <div className="bg-muted/30 rounded-xl p-5 border border-muted">
          <div 
            className="text-sm text-foreground whitespace-pre-line font-sans leading-relaxed"
            dangerouslySetInnerHTML={{ __html: makeFirstSentenceBoldPlainText(historial) }}
          />
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="bg-primary/5 border-b border-border">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Briefcase className="h-5 w-5" />
            Historial Profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              <span className="text-muted-foreground">Cargando historial...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-card">
        <CardHeader className="bg-destructive/5 border-b border-destructive/20">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Briefcase className="h-5 w-5" />
            Historial Profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center bg-destructive/10 rounded-xl p-6 border border-destructive/20">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-destructive/20 rounded-full">
                <Briefcase className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-destructive mb-1">
                  Error al cargar el historial profesional
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-lg">
      <CardHeader className="bg-primary/5 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Briefcase className="h-5 w-5" />
          Historial Profesional
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {professionalHistory?.professionalHistory &&
        professionalHistory.professionalHistory.length > 0 ? (
          <div className="space-y-8">
            {professionalHistory.professionalHistory.map((person, index) => (
              <div key={index} className="space-y-6">
                <div className="bg-accent/20 rounded-xl p-4 border border-accent/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-foreground text-lg">
                          {person.nombre} {person.apellido}
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/30 font-bold"
                        >
                          {person.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {person.historial && (
                  <div className="ml-4 border-l-2 border-primary/20 pl-6">
                    {renderHistorialProfesional(person.historial)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="p-6 bg-muted/30 rounded-full border border-muted">
                <Briefcase className="h-12 w-12 text-muted-foreground/60" />
              </div>
              <div className="space-y-2">
                <p className="text-foreground font-medium text-lg">
                  No hay historial profesional registrado
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  El historial profesional aparecerá aquí cuando se agregue información sobre la experiencia laboral
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}