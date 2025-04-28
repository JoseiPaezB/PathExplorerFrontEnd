import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
function DropdownFilter({
  setSelectedEstado,
}: {
  setSelectedEstado: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtrar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setSelectedEstado("Todos")}>
          Todos
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSelectedEstado("ACTIVO")}>
          Activos
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSelectedEstado("PLANEACION")}>
          Planeacion
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSelectedEstado("FINALIZADO")}>
          Finalizado
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownFilter;
