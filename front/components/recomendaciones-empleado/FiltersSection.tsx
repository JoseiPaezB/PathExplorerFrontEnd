import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersSectionProps {
  rolesFilters: { roleState?: string; roleSkills?: string };
  applyRolesFilters: (key: string, value: string) => void;
}

const projectStates = [
  "PLANIFICACION",
  "EN_PROGRESO", 
  "FINALIZADO",
  "PAUSADO",
];

const skillCategories = [
  "TECNICA",
  "BLANDA",
  "LIDERAZGO",
  "GESTION",
  "DOMINIO",
];

export function FiltersSection({ rolesFilters, applyRolesFilters }: FiltersSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select
        value={rolesFilters.roleState || "todos"}
        onValueChange={(value: string) => {
          const filterValue = value === "todos" ? "" : value;
          applyRolesFilters("roleState", filterValue);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Estado del proyecto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los estados</SelectItem>
          {projectStates.map((state: string) => (
            <SelectItem key={state} value={state}>
              {state.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={rolesFilters.roleSkills || "todas"}
        onValueChange={(value: string) => {
          const filterValue = value === "todas" ? "" : value;
          applyRolesFilters("roleSkills", filterValue);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Categoría de habilidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las categorías</SelectItem>
          {skillCategories.map((category: string) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}