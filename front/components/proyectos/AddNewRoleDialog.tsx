"use client";

import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useAddProjectRole } from "@/hooks/useAddProjectRole";
import { fetchGetAllSkills } from "@/hooks/fetchGetAllSkills";
import { RoleFormData, SkillFormData } from "@/types/projectsAndRoles";
import { TransformedProject } from "@/types/projectsAdministration";
import { RoleSkill } from "@/types/projectsAdministration";

interface AddRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: TransformedProject | null;
  onSuccess: () => void;
}

export default function AddNewRoleDialog({
  isOpen,
  onClose,
  project,
  onSuccess,
}: AddRoleDialogProps) {
  const { addRoleToProject, isSubmitting } = useAddProjectRole();
  const { skills: availableSkills, isLoading: loadingSkills } =
    fetchGetAllSkills();

  const [roleData, setRoleData] = useState<RoleFormData>({
    id_proyecto: project?.id || 0,
    titulo: "",
    descripcion: "",
    nivel_experiencia_requerido: 1,
    skills: [] as SkillFormData[],
  });

  const [selectedSkillId, setSelectedSkillId] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRoleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setRoleData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const addSkillToRole = () => {
    if (!selectedSkillId || !availableSkills) return;

    const skill = availableSkills.find(
      (s) => s.id_habilidad === parseInt(selectedSkillId)
    );
    if (!skill) return;

    const exists = roleData.skills.some(
      (h) => h.id_habilidad === skill.id_habilidad
    );
    if (exists) return;

    const newSkill: RoleSkill = {
      nombre: skill.nombre,
      id_habilidad: skill.id_habilidad,
      nivel_minimo_requerido:
        roleData.skills.find((h) => h.id_habilidad === skill.id_habilidad)
          ?.nivel_minimo_requerido || 1,
      importancia: 3,
    };

    setRoleData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    setSelectedSkillId("");
  };

  const removeSkill = (skillId: number) => {
    setRoleData((prev) => ({
      ...prev,
      skills: prev.skills.filter((h) => h.id_habilidad !== skillId),
    }));
  };

  const updateSkill = (
    skillId: number,
    field: "nivel_minimo_requerido" | "importancia",
    value: number
  ) => {
    setRoleData((prev) => ({
      ...prev,
      skills: prev.skills.map((h) =>
        h.id_habilidad === skillId ? { ...h, [field]: value } : h
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project || !roleData.titulo || !roleData.descripcion) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    try {
      roleData.id_proyecto = project.id;
      const result = await addRoleToProject(roleData);
      if (result) {
        setRoleData({
          id_proyecto: project.id,
          titulo: "",
          descripcion: "",
          nivel_experiencia_requerido: 1,
          skills: [],
        });
        onSuccess();
      } else {
        alert("Error al agregar el rol");
      }
    } catch (error) {
      console.error("Error adding role:", error);
      alert("Error al agregar el rol");
    }
  };

  const handleClose = () => {
    setRoleData({
      id_proyecto: 0,
      titulo: "",
      descripcion: "",
      nivel_experiencia_requerido: 1,
      skills: [],
    });
    setSelectedSkillId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Agregar Rol - {project?.project || "Proyecto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título del Rol *</Label>
            <Input
              id="titulo"
              name="titulo"
              value={roleData.titulo}
              onChange={handleInputChange}
              placeholder="Ej: Desarrollador Frontend"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={roleData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe las responsabilidades y objetivos del rol"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nivel_experiencia">Nivel de Experiencia</Label>
              <Select
                value={roleData.nivel_experiencia_requerido.toString()}
                onValueChange={(value) =>
                  handleSelectChange("nivel_experiencia_requerido", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Junior (1)</SelectItem>
                  <SelectItem value="2">Semi-Senior (2)</SelectItem>
                  <SelectItem value="3">Senior (3)</SelectItem>
                  <SelectItem value="4">Experto (4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Habilidades Requeridas</Label>
              <div className="flex gap-2 items-center">
                <Select
                  value={selectedSkillId}
                  onValueChange={setSelectedSkillId}
                  disabled={loadingSkills}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecciona habilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills?.map((skill) => (
                      <SelectItem
                        key={skill.id_habilidad}
                        value={skill.id_habilidad.toString()}
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
                  onClick={addSkillToRole}
                  disabled={!selectedSkillId}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {roleData.skills.length === 0 ? (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">
                  No hay habilidades agregadas. Añade las habilidades requeridas
                  para este rol.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {roleData.skills.map((skill) => (
                  <Card key={skill.id_habilidad}>
                    <CardContent className="p-3">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <p className="font-medium text-sm">{skill.nombre}</p>
                        </div>

                        <div className="col-span-3">
                          <Label className="text-xs">Nivel mínimo</Label>
                          <Select
                            value={skill.nivel_minimo_requerido.toString()}
                            onValueChange={(value) =>
                              updateSkill(
                                skill.id_habilidad,
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
                                skill.id_habilidad,
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
                            onClick={() => removeSkill(skill.id_habilidad)}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Agregando..." : "Agregar Rol"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
