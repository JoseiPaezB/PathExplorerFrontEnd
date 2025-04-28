"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { InfoIcon, UserIcon } from "lucide-react";
import { useProjectUtils } from "@/hooks/useProjectUtils";

interface ProjectMetaInfoProps {
  managerName: string | undefined;
  status: string;
}

export default function ProjectMetaInfo({
  managerName,
  status,
}: ProjectMetaInfoProps) {
  const { getBadgeColor } = useProjectUtils();

  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-gray-600">
          <UserIcon size={14} />
          <span className="font-medium">Gerente</span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" alt={managerName} />
            <AvatarFallback>{managerName?.[0]}</AvatarFallback>
          </Avatar>
          <span>{managerName || "No asignado"}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-gray-600">
          <InfoIcon size={14} />
          <span className="font-medium">Estado</span>
        </div>
        <Badge variant="outline" className={getBadgeColor(status)}>
          {status}
        </Badge>
      </div>
    </div>
  );
}
