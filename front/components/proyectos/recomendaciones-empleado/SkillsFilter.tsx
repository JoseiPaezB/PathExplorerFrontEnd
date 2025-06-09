import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { fetchGetAllSkills } from "@/hooks/fetchGetAllSkills";

interface SkillsFilterProps {
  selectedSkill: string;
  onSkillChange: (skill: string) => void;
}

export function SkillsFilter({ selectedSkill, onSkillChange }: SkillsFilterProps) {
  const { skills, isLoading } = fetchGetAllSkills();

  const handleSkillSelect = (value: string) => {
    if (value === "todas") {
      onSkillChange("");
    } else {
      onSkillChange(value);
    }
  };

  const clearFilter = () => {
    onSkillChange("");
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedSkill || "todas"}
        onValueChange={handleSkillSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={isLoading ? "Cargando..." : "Filtrar por habilidad"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las habilidades</SelectItem>
          {skills?.map((skill) => (
            <SelectItem key={skill.id_habilidad} value={skill.nombre}>
              {skill.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedSkill && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilter}
          className="h-9 px-2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}