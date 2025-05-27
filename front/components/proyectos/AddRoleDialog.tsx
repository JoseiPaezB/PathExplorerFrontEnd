import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Skill,
  ProjectRole,
  ProjectFormData,
  RoleSkill,
} from "@/types/projectsAdministration";
import { useState } from "react";

function AddRoleDialog({
  addRole,
  removeRole,
  updateRole,
  updateSkill,
  addSkillToRole,
  removeSkillFromRole,
  skills,
  formData,
  loadingSkills,
}: {
  addRole: () => void;
  updateRole: (
    index: number,
    field: keyof ProjectRole,
    value: string | number
  ) => void;
  removeRole: (index: number) => void;
  updateSkill: (
    roleIndex: number,
    skillIndex: number,
    field: keyof RoleSkill,
    value: number
  ) => void;
  addSkillToRole: (
    roleIndex: number,
    skillData?: {
      id_habilidad: number;
      nombre: string;
      nivel_minimo_requerido: number;
      importancia: number;
    }
  ) => void;
  removeSkillFromRole: (roleIndex: number, skillIndex: number) => void;
  skills: Skill[];
  formData: ProjectFormData;
  loadingSkills: boolean;
}) {
  const [selectedSkillIds, setSelectedSkillIds] = useState<{
    [roleIndex: number]: string;
  }>({});

  const handleSkillSelection = (roleIndex: number, skillId: string) => {
    setSelectedSkillIds((prev) => ({
      ...prev,
      [roleIndex]: skillId,
    }));
  };

  const addSkillToRoleWithSelection = (roleIndex: number) => {
    const selectedSkillId = selectedSkillIds[roleIndex];
    if (!selectedSkillId) return;

    const skill = skills.find(
      (s) => s.id_habilidad === parseInt(selectedSkillId)
    );
    if (!skill) return;

    const exists = formData.roles[roleIndex].habilidades.some(
      (h) => h.id_habilidad === skill.id_habilidad
    );
    if (exists) return;

    const skillData = {
      id_habilidad: skill.id_habilidad,
      nombre: skill.nombre,
      nivel_minimo_requerido: 3,
      importancia: 3,
    };

    setSelectedSkillIds((prev) => ({
      ...prev,
      [roleIndex]: "",
    }));

    addSkillToRole(roleIndex, skillData);
  };

  return (
    <div className="pt-4 border-t mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Roles del Proyecto</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRole}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Añadir Rol
        </Button>
      </div>

      {formData.roles.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-500">
            No hay roles definidos. Añade al menos un rol para este proyecto.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.roles.map((role, index) => (
            <Card key={index} className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeRole(index)}
                className="absolute right-2 top-2 text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>

              <CardHeader className="pb-2">
                <CardTitle className="text-base">Rol #{index + 1}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`role-title-${index}`}>
                      Título del Rol
                    </Label>
                    <Input
                      id={`role-title-${index}`}
                      value={role.titulo}
                      onChange={(e) =>
                        updateRole(index, "titulo", e.target.value)
                      }
                      placeholder="Ej: Desarrollador Frontend"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`role-level-${index}`}>
                      Nivel de Experiencia
                    </Label>
                    <Select
                      value={role.nivel_experiencia_requerido.toString()}
                      onValueChange={(value) =>
                        updateRole(
                          index,
                          "nivel_experiencia_requerido",
                          parseInt(value)
                        )
                      }
                    >
                      <SelectTrigger id={`role-level-${index}`}>
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Junior</SelectItem>
                        <SelectItem value="2">Semi-Senior</SelectItem>
                        <SelectItem value="3">Senior</SelectItem>
                        <SelectItem value="4">Experto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`role-desc-${index}`}>
                    Descripción del Rol
                  </Label>
                  <Textarea
                    id={`role-desc-${index}`}
                    value={role.descripcion}
                    onChange={(e) =>
                      updateRole(index, "descripcion", e.target.value)
                    }
                    placeholder="Describe las responsabilidades de este rol"
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <Label>Habilidades requeridas</Label>
                    <div className="flex gap-2 items-center">
                      <Select
                        value={selectedSkillIds[index] || ""}
                        onValueChange={(value) =>
                          handleSkillSelection(index, value)
                        }
                        disabled={loadingSkills}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Selecciona habilidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {skills?.map((skill) => (
                            <SelectItem
                              key={skill.id_habilidad}
                              value={skill.id_habilidad.toString()}
                              disabled={role.habilidades.some(
                                (h) => h.id_habilidad === skill.id_habilidad
                              )}
                            >
                              {skill.nombre} - {skill.categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSkillToRoleWithSelection(index)}
                        disabled={!selectedSkillIds[index]}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {role.habilidades.length === 0 ? (
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500">
                        No hay habilidades definidas. Añade las habilidades
                        requeridas para este rol.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {role.habilidades.map((skill, skillIndex) => (
                        <Card key={skill.id_habilidad}>
                          <CardContent className="p-3">
                            <div className="grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-4">
                                <p className="font-medium text-sm">
                                  {skill.nombre}
                                </p>
                              </div>

                              <div className="col-span-3">
                                <Label className="text-xs">Nivel mínimo</Label>
                                <Select
                                  value={skill.nivel_minimo_requerido.toString()}
                                  onValueChange={(value) =>
                                    updateSkill(
                                      index,
                                      skillIndex,
                                      "nivel_minimo_requerido",
                                      parseInt(value)
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="col-span-3">
                                <Label className="text-xs">Importancia</Label>
                                <Select
                                  value={skill.importancia.toString()}
                                  onValueChange={(value) =>
                                    updateSkill(
                                      index,
                                      skillIndex,
                                      "importancia",
                                      parseInt(value)
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Baja</SelectItem>
                                    <SelectItem value="3">Media</SelectItem>
                                    <SelectItem value="5">Alta</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="col-span-2 flex justify-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeSkillFromRole(index, skillIndex)
                                  }
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddRoleDialog;
