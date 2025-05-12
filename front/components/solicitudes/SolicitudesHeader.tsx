import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";

function SolicitudesHeader({
  setFiltro,
  setSearchTerm,
  filtro,
  searchTerm,
}: {
  setFiltro: React.Dispatch<React.SetStateAction<string>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filtro: string;
  searchTerm: string;
}) {
  const handleFilter = (selectedFilter: string) => {
    setFiltro(selectedFilter);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Autorizaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las solicitudes de acceso y permisos
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar solicitudes..."
            className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>{filtro || "TODOS"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleFilter("PENDIENTE")}>
              PENDIENTE
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilter("APROBADA")}>
              APROBADA
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilter("RECHAZADA")}>
              RECHAZADA
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilter("")}>
              TODOS
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default SolicitudesHeader;
