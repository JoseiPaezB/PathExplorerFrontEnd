import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function UsuariosHeader({
  applyFilters,
}: {
  applyFilters: (searchTerm: string, stateFilter: string) => void;
}) {
  const [filtro, setFiltro] = useState<string>("");
  const handleFilter = (filtro: string) => {
    setFiltro(filtro);
    applyFilters("", filtro);
  };

  const userSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    applyFilters(searchTerm, filtro);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar usuarios..."
          className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onChange={userSearch}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <span>Estado</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => handleFilter("ASIGNADO")}>
            ASIGNADO
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleFilter("BANCA")}>
            BANCA
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleFilter("")}>
            Todos
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UsuariosHeader;
