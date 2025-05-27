"use client";

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
import { TransformedProject } from "@/types/projectsAdministration";

interface ProjectEditFormProps {
  editedProject: TransformedProject | null;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleRoleChange: (
    roleIndex: number,
    field: string,
    value: string | number
  ) => void;
  handleSkillChange: (
    roleIndex: number,
    skillIndex: number,
    field: string,
    value: string | number
  ) => void;
}

export default function ProjectEditForm({
  editedProject,
  handleChange,
  handleRoleChange,
  handleSkillChange,
}: ProjectEditFormProps) {
  if (!editedProject) return null;

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-1">
        <Label htmlFor="projectName">Nombre del Proyecto</Label>
        <Input
          type="text"
          id="projectName"
          name="project"
          value={editedProject.project || ""}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={editedProject.description}
          onChange={handleChange}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="startDate">Fecha Inicio</Label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={editedProject.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="endDate">Fecha Fin Estimada</Label>
          <Input
            type="date"
            id="endDate"
            name="endDate"
            value={editedProject.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="priority">Prioridad</Label>
        <Select
          value={editedProject.prioridad?.toString() || "3"}
          onValueChange={(value) => {
            const event = {
              target: { name: "priority", value },
            } as React.ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Baja</SelectItem>
            <SelectItem value="3">Media</SelectItem>
            <SelectItem value="5">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {editedProject.allRoles && editedProject.allRoles.length > 0 && (
        <div className="pt-4 border-t mt-6">
          <h3 className="text-lg font-medium mb-4">Roles del Proyecto</h3>

          <div className="space-y-4">
            {editedProject.allRoles.map((role, roleIndex) => (
              <Card key={role.id_rol}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Rol #{roleIndex + 1}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`role-title-${roleIndex}`}>
                        Título del Rol
                      </Label>
                      <Input
                        id={`role-title-${roleIndex}`}
                        value={role.titulo || ""}
                        onChange={(e) =>
                          handleRoleChange(roleIndex, "titulo", e.target.value)
                        }
                        placeholder="Ej: Desarrollador Frontend"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`role-exp-${roleIndex}`}>
                        Nivel de Experiencia
                      </Label>
                      <Select
                        value={
                          role.nivel_experiencia_requerido?.toString() || "1"
                        }
                        onValueChange={(value) =>
                          handleRoleChange(
                            roleIndex,
                            "nivel_experiencia_requerido",
                            parseInt(value)
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Junior (1)</SelectItem>
                          <SelectItem value="2">Semi-Senior (2)</SelectItem>
                          <SelectItem value="3">Senior (3)</SelectItem>
                          <SelectItem value="4">Lead (4)</SelectItem>
                          <SelectItem value="5">Expert (5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`role-desc-${roleIndex}`}>
                      Descripción del Rol
                    </Label>
                    <Textarea
                      id={`role-desc-${roleIndex}`}
                      value={role.descripcion}
                      onChange={(e) =>
                        handleRoleChange(
                          roleIndex,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe las responsabilidades de este rol"
                      rows={2}
                    />
                  </div>

                  {role.skills && role.skills.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <Label>Habilidades requeridas</Label>

                      <div className="space-y-2">
                        {role.skills.map((skill, skillIndex) => (
                          <div
                            key={`${role.id_rol}-${skillIndex}`}
                            className="grid grid-cols-12 gap-2 items-center p-3 rounded-md bg-gray-50"
                          >
                            <div className="col-span-5">
                              <Label className="text-xs text-gray-600">
                                {skill.nombre}
                              </Label>
                            </div>

                            <div className="col-span-3">
                              <Label className="text-xs">Nivel mínimo</Label>
                              <Select
                                value={
                                  skill.nivel_minimo_requerido?.toString() ||
                                  "1"
                                }
                                onValueChange={(value) =>
                                  handleSkillChange(
                                    roleIndex,
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

                            <div className="col-span-4">
                              <Label className="text-xs">Importancia</Label>
                              <Select
                                value={skill.importancia?.toString()}
                                onValueChange={(value) =>
                                  handleSkillChange(
                                    roleIndex,
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
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
