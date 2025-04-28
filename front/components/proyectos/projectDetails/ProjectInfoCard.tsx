"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

interface ProjectInfoCardProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function ProjectInfoCard({
  title,
  description,
  startDate,
  endDate,
}: ProjectInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
          <p className="text-sm">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-500">Fecha Inicio</h4>
            <div className="flex items-center gap-2">
              <CalendarIcon size={14} />
              <span className="text-sm">{startDate}</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-500">Fecha Fin</h4>
            <div className="flex items-center gap-2">
              <CalendarIcon size={14} />
              <span className="text-sm">{endDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
