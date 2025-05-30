"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getBadgeImportance } from "@/lib/functions";
import { Role } from "@/types/projectsAdministration";

export default function ProjectRolesCard({ roles }: { roles: Role[] }) {
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!roles || roles.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Roles en el Proyecto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {roles.map((role, index) => (
          <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
            <h4 className="font-medium">{role.titulo}</h4>
            <p className="text-sm text-gray-600 mt-1">{role.descripcion}</p>

            {role.skills && role.skills.length > 0 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-500 mb-1">
                  Habilidades requeridas
                </h5>
                <div className="flex flex-wrap gap-1">
                  {role.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className={getBadgeImportance(skill.importancia)}
                    >
                      {skill.nombre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {role.assignments && role.assignments.length > 0 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-500 mb-1">
                  Asignados
                </h5>
                <div className="flex flex-wrap gap-1">
                  {role.assignments.map((person, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-xs">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback>
                          {getInitials(`${person.nombre} ${person.apellido}`)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {person.nombre} {person.apellido}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
