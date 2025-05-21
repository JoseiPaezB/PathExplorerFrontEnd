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
import { useState } from "react";
import { fetchGetFilterOptions } from "@/hooks/fetchGetFilterOptions";
import SkillsFilter from "@/components/cursos-y-certificaciones/recomendaciones-modal/SkillsFilter";
import InstitutionsFilter from "./InstitutionsFilter";

function FilterComponents({
  handleSubmit,
  closeModal,
  isLoading,
}: {
  handleSubmit: (
    selectedCourseCategory: string | null,
    selectedCourseInstitution: string | null,
    selectedCourseSkill: string[] | null,
    selectedCertificationInstitution: string | null,
    selectedCertificationSkill: string[] | null
  ) => void;
  closeModal: () => void;
  isLoading: boolean;
}) {
  const { filters } = fetchGetFilterOptions();
  const [selectedCourseCategory, setSelectedCourseCategory] = useState<
    string | null
  >(null);
  const [selectedCourseInstitution, setSelectedCourseInstitution] = useState<
    string | null
  >(null);
  const [
    selectedCertificationInstitution,
    setSelectedCertificationInstitution,
  ] = useState<string | null>(null);
  const [selectedCourseSkill, setSelectedCourseSkill] = useState<
    string[] | null
  >(null);
  const [selectedCertificationSkill, setSelectedCertificationSkill] = useState<
    string[] | null
  >(null);
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex gap-4 justify-center items-start">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Filtros de Cursos</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <span>{selectedCourseCategory || "Categoría de curso"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedCourseCategory(null)}>
                Todos
              </DropdownMenuItem>
              {filters?.uniqueCategoriesCourses.map((category) => {
                return (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCourseCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>

          <InstitutionsFilter
            uniqueInstitutions={filters?.uniqueInstitutionsCourses}
            setSelectedInstitution={setSelectedCourseInstitution}
            selectedInstitution={selectedCourseInstitution}
          />

          <SkillsFilter
            allSkillsNames={filters?.allSkillsNames || []}
            setSelectedSkill={setSelectedCourseSkill}
            selectedSkill={selectedCourseSkill}
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Filtros de Certificaciones</h3>
          <InstitutionsFilter
            uniqueInstitutions={filters?.uniqueInstitutionsCertifications}
            setSelectedInstitution={setSelectedCertificationInstitution}
            selectedInstitution={selectedCertificationInstitution}
          />
          <SkillsFilter
            allSkillsNames={filters?.allSkillsNames || []}
            setSelectedSkill={setSelectedCertificationSkill}
            selectedSkill={selectedCertificationSkill}
          />
        </div>
      </div>

      <div className="flex justify-between mt-4 bottom-4 right-4 space-between">
        <Button onClick={closeModal}>Cerrar</Button>
        <Button
          disabled={isLoading}
          onClick={() =>
            handleSubmit(
              selectedCourseCategory,
              selectedCourseInstitution,
              selectedCourseSkill,
              selectedCertificationInstitution,
              selectedCertificationSkill
            )
          }
        >
          Buscar recomendaciones
        </Button>
      </div>
    </div>
  );
}

export default FilterComponents;
