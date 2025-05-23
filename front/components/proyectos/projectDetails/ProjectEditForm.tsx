"use client";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableProject } from "@/types/projectsAdministration";

interface ProjectEditFormProps {
  editedProject: EditableProject | null;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function ProjectEditForm({
  editedProject,
  handleChange,
}: ProjectEditFormProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-1">
        <label className="block text-sm text-gray-600" htmlFor="projectName">
          Nombre del Proyecto
        </label>
        <input
          type="text"
          id="projectName"
          name="project"
          value={editedProject?.project || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-gray-600" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={editedProject?.description || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm text-gray-600" htmlFor="startDate">
            Fecha Inicio
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={editedProject?.startDate || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-gray-600" htmlFor="endDate">
            Fecha Fin Estimada
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={editedProject?.endDate || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-gray-600" htmlFor="priority">
          Prioridad
        </label>
        <select
          id="priority"
          name="priority"
          value={editedProject?.priority || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="1">Baja</option>
          <option value="3">Media</option>
          <option value="5">Alta</option>
        </select>
      </div>
      <div className="pt-4 border-t mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Roles del Proyecto</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Añadir Rol
          </Button>
        </div>

        {editedProject?.allRoles?.length === 0 ? (
          <div className="text-center p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">
              No hay roles definidos. Añade al menos un rol para este proyecto.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {editedProject?.allRoles?.map((role, index) => (
              <Card key={index} className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
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
                        placeholder="Ej: Desarrollador Frontend"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`role-desc-${index}`}>
                      Descripción del Rol
                    </Label>
                    <Textarea
                      id={`role-desc-${index}`}
                      value={role.descripcion}
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
                        className="flex items-center gap-1"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Añadir Habilidad
                      </Button>
                    </div>

                    {role.skills?.length === 0 ? (
                      <div className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500">
                          No hay habilidades definidas.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {role.skills?.map((skill, skillIndex) => (
                          <div
                            key={skillIndex}
                            className="grid grid-cols-12 gap-2 items-center p-2 rounded-md bg-gray-50"
                          >
                            <div className="col-span-3">
                              <Label className="text-xs">Nivel mínimo</Label>
                              <Select
                                value={skill.nivel_minimo_requerido.toString()}
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
                              <Select value={skill.importancia.toString()}>
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
    </div>
  );
}
