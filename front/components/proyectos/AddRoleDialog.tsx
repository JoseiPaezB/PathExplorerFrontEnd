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
  addSkillToRole: (roleIndex: number) => void;
  removeSkillFromRole: (roleIndex: number, skillIndex: number) => void;
  skills: Skill[];
  formData: ProjectFormData;
  loadingSkills: boolean;
}) {
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkillToRole(index)}
                      className="flex items-center gap-1"
                      disabled={loadingSkills || skills.length === 0}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Añadir Habilidad
                    </Button>
                  </div>

                  {role.habilidades.length === 0 ? (
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500">
                        No hay habilidades definidas.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {role.habilidades.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="grid grid-cols-12 gap-2 items-center p-2 rounded-md bg-gray-50"
                        >
                          <div className="col-span-4">
                            <Select
                              value={skill.id_habilidad.toString()}
                              onValueChange={(value) =>
                                updateSkill(
                                  index,
                                  skillIndex,
                                  "id_habilidad",
                                  parseInt(value)
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar habilidad" />
                              </SelectTrigger>
                              <SelectContent>
                                {skills.map((s) => (
                                  <SelectItem
                                    key={s.id_habilidad}
                                    value={s.id_habilidad.toString()}
                                  >
                                    {s.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                                <SelectValue placeholder="Nivel" />
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
                                <SelectValue placeholder="Importancia" />
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
