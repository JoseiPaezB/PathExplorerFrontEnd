import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
function InstitutionsFilter({
  uniqueInstitutions,
  setSelectedInstitution,
  selectedInstitution,
}: {
  uniqueInstitutions: string[] | undefined;
  setSelectedInstitution: React.Dispatch<React.SetStateAction<string | null>>;
  selectedInstitution: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <span>{selectedInstitution || "Institución de certificación"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setSelectedInstitution(null)}>
          Todos
        </DropdownMenuItem>
        {uniqueInstitutions?.map((institution) => {
          return (
            <DropdownMenuItem
              key={institution}
              onClick={() => setSelectedInstitution(institution)}
            >
              {institution}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default InstitutionsFilter;
