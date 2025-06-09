"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Brain, Code, Users } from "lucide-react";
import type { SkillsResponse } from "@/types/users";

interface SkillsSectionProps {
  skills: SkillsResponse | null;
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  // Separar habilidades por categoría
  const technicalSkills = skills?.skills?.filter(skill => skill.categoria === 'TECNICA') || [];
  const softSkills = skills?.skills?.filter(skill => skill.categoria === 'BLANDA') || [];

  const SkillCard = ({ skill }: { skill: any }) => {
    const percentage = (skill.nivel_demostrado / skill.nivel_maximo) * 100;

    return (
        <div className="border border-purple-100 rounded-lg p-3 bg-gradient-to-r from-purple-25 to-blue-25 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-purple-900 text-sm">
              {skill.nombre}
            </h4>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              {skill.nivel_demostrado}/{skill.nivel_maximo}
            </Badge>
          </div>

          <Progress
              value={percentage}
              className="h-2 mb-2"
          />

          {skill.descripcion && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {skill.descripcion}
              </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Desde: {new Date(skill.fecha_adquisicion).getFullYear()}</span>
            {skill.evidencia && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Con evidencia
                </Badge>
            )}
          </div>
        </div>
    );
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habilidades Técnicas */}
        <Card className="border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Code className="h-5 w-5 text-purple-600" />
              Habilidades Técnicas ({technicalSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80"> {/* Altura fija */}
              <ScrollArea className="h-full p-6">
                {technicalSkills.length > 0 ? (
                    <div className="space-y-3">
                      {technicalSkills.map((skill, index) => (
                          <SkillCard key={index} skill={skill} />
                      ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Code className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">No hay habilidades técnicas registradas</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Las habilidades técnicas aparecerán aquí cuando se agreguen
                      </p>
                    </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Habilidades Blandas */}
        <Card className="border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Users className="h-5 w-5 text-purple-600" />
              Habilidades Blandas ({softSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80"> {/* Altura fija */}
              <ScrollArea className="h-full p-6">
                {softSkills.length > 0 ? (
                    <div className="space-y-3">
                      {softSkills.map((skill, index) => (
                          <SkillCard key={index} skill={skill} />
                      ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Users className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">No hay habilidades blandas registradas</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Las habilidades blandas aparecerán aquí cuando se agreguen
                      </p>
                    </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}