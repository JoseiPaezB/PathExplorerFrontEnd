import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

function SearchBar({
  activeTab,
  searchTerm,
  setSearchTerm,
}: {
  activeTab: string;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`Buscar ${
            activeTab === "certificaciones" ? "certificaciones" : "cursos"
          }...`}
          className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>
    </div>
  );
}

export default SearchBar;
