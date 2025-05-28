import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { RecommendedRole, Skill } from "@/types/recommendations";

interface RoleCardProps {
  role: RecommendedRole;
  onAssignRole: (role: RecommendedRole) => void;
  hasPendingRequest: boolean;
}

export function RoleCard({ role, onAssignRole, hasPendingRequest }: RoleCardProps) {
  const { toast } = useToast();

  return (
    <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">
              {role.roleWithProject?.titulo || "Rol sin título"}
            </h3>
            <Badge
              variant={
                role.roleWithProject?.project?.[0]?.estado === "EN_PROGRESO"
                  ? "default"
                  : "outline"
              }
            >
              {role.roleWithProject?.project?.[0]?.estado?.replace("_", " ") ||
                "Estado desconocido"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {role.roleWithProject?.descripcion}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Compatibilidad: {role.compatibilidad || 85}%
          </Badge>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Proyecto:</p>
          <p className="text-sm">
            {role.roleWithProject?.project?.[0]?.nombre ||
              "Sin proyecto asignado"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Manager:</p>
          <p className="text-sm">
            {role.roleWithProject?.manager?.[0]?.nombre
              ? `${role.roleWithProject.manager[0].nombre} ${role.roleWithProject.manager[0].apellido}`
              : "Sin manager asignado"}
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        <p className="text-sm font-medium mb-2">Habilidades requeridas:</p>
        <div className="flex flex-wrap gap-2">
          {role.roleWithProject?.skills
            ?.slice(0, 5)
            .map((skill: Skill, idx: number) => (
              <Badge key={idx} variant="outline" className="bg-slate-50">
                {skill.nombre}{" "}
                {skill.nivel_minimo_requerido
                  ? `(Nivel ${skill.nivel_minimo_requerido})`
                  : ""}
              </Badge>
            ))}
          {(role.roleWithProject?.skills?.length || 0) > 5 && (
            <Badge variant="outline">
              +{(role.roleWithProject?.skills?.length || 0) - 5} más
            </Badge>
          )}
          {(!role.roleWithProject?.skills ||
            role.roleWithProject.skills.length === 0) && (
            <span className="text-sm text-gray-400">
              No hay habilidades especificadas
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast({
              title: "Función en desarrollo",
              description:
                "La función para ver detalles estará disponible próximamente.",
              variant: "default",
            });
          }}
        >
          Ver detalles
        </Button>
        <Button
          size="sm"
          onClick={() => onAssignRole(role)}
          disabled={hasPendingRequest}
        >
          Asignar
        </Button>
      </div>
    </div>
  );
}