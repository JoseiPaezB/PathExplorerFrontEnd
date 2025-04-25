"use client";

import { useState } from "react";
import {
  ChevronDown,
  Clock,
  Download,
  Filter,
  Plus,
  Search,
  User,
  X,
  PlusCircle,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { useEffect } from "react";
import { getManagerProjects, formatDate } from "./projectService"; // Adjust the import path as necessary
import ProjectDetailsModal from "./projectDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getEmpleadosBanca } from "@/app/(dashboard)/usuarios/actions";
import { UserInfoBanca } from "@/types/users";

// == THIS IS A HYBRID TEST (REAL DATA + PLACEHOLDER DATA) == //
import { getBestCandidatesForRole } from "@/app/(dashboard)/proyectos/actions";

const roleToIdMap: Record<string, number> = {
  "Desarrollador Frontend": 52,
  "DevOps Engineer": 22,
  "Desarrollador Full Stack": 7,
  "UI/UX Designer": 9,
  "QA Engineer": 10,
};
// == THIS IS A HYBRID TEST (REAL DATA + PLACEHOLDER DATA) == //

export default function ProyectosPage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<TransformedProject | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  // Keep these as they are for your displayed data
  interface Role {
    id_rol: number;
    titulo: string;
    descripcion: string;
    assignments: Assignment[];
    habilidades?: {
      id_habilidad: number;
      nombre: string; // Skill name for display
      nivel_minimo_requerido: number;
      importancia: number;
    }[];
  }

  interface Assignment {
    nombre: string;
    apellido: string;
  }

  interface TransformedProject {
    managerName: string;
    project: string;
    role: string;
    status: string;
    assignedTo: string | null;
    startDate: string;
    endDate: string;
    progress: number;
    id: number;
    allRoles: Role[];
    description: string;
  }

  // Update these to match your API's expected format
  interface Skill {
    id_habilidad: number;
    nombre: string;
    categoria: string;
    descripcion?: string;
  }

  interface RoleSkill {
    id_habilidad: number;
    nivel_minimo_requerido: number;
    importancia: number;
  }

  // Update your ProjectRole interface to include skills
  interface ProjectRole {
    titulo: string;
    descripcion: string;
    importancia: number;
    nivel_experiencia_requerido: number;
    habilidades: RoleSkill[];
  }

  interface ProjectFormData {
    nombre: string;
    descripcion: string;
    fecha_inicio: string; // This will be an ISO date string
    fecha_fin_estimada: string; // This will be an ISO date string
    prioridad: number; // Change to number
    roles: ProjectRole[];
  }

  const [projects, setProjects] = useState<TransformedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("Todos");

  useEffect(() => {
    const fetchProjects = async () => {
      interface Project {
        id_manager: number;
        id_proyecto: number;
        nombre: string;
        descripcion: string;
        fecha_inicio: string;
        fecha_fin_estimada: string;
        estado: string;
        roles: Role[];
      }

      interface Role {
        id_rol: number;
        titulo: string;
        descripcion: string;
        assignments: Assignment[];
        habilidades?: {
          id_habilidad: number;
          nombre: string; // Skill name for display
          nivel_minimo_requerido: number;
          importancia: number;
        }[];
      }

      interface Assignment {
        nombre: string;
        apellido: string;
      }

      try {
        setLoading(true);
        // Get the JWT token from localStorage or your auth context
        const token = localStorage.getItem("token");

        // Make API call to fetch manager projects
        const response = await axios.get(
          "http://localhost:4000/api/projects/manager-projects-with-roles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userInfoRaw = localStorage.getItem("user");
        console.log("All localStorage keys:", Object.keys(localStorage));
        const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("Raw userInfo from localStorage:", userInfoRaw);
        console.log("Parsed userInfo:", userInfo);
        const managerName =
          userInfo.nombre && userInfo.apellido
            ? `${userInfo.nombre} ${userInfo.apellido}`
            : "Gerente Actual";

        if (response.data.success && response.data.hasProjects) {
          // Transform the backend data to match the frontend format
          const transformedProjects = response.data.managerProjects.map(
            (project: Project) => {
              // Calculate progress based on project status or other metrics
              console.log(
                `Project ${project.nombre} roles with skills:`,
                project.roles.map((r) => ({
                  titulo: r.titulo,
                  habilidades: r.habilidades,
                }))
              );
              let progress = 0;
              if (project.estado === "Completado") {
                progress = 100;
              } else if (project.estado === "En progreso") {
                // You could calculate this based on dates or other metrics
                const startDate = new Date(project.fecha_inicio);
                const endDate = new Date(project.fecha_fin_estimada);
                const today = new Date();

                const totalDuration = endDate.getTime() - startDate.getTime();
                const elapsed = today.getTime() - startDate.getTime();

                progress = Math.min(
                  Math.round((elapsed / totalDuration) * 100),
                  99
                );
              }

              // Get the first assignment for each role (if any)
              const assignedPersons = project.roles.flatMap((role) =>
                role.assignments.map((assignment) => ({
                  roleTitulo: role.titulo,
                  roleId: role.id_rol,
                  ...assignment,
                }))
              );

              return {
                managerName: managerName,
                project: project.nombre,
                role:
                  project.roles.length > 0
                    ? project.roles[0].titulo
                    : "Multiple Roles",
                status: project.estado || "Pendiente",
                assignedTo:
                  assignedPersons.length > 0
                    ? `${assignedPersons[0].nombre} ${assignedPersons[0].apellido}`
                    : null,
                startDate: formatDate(project.fecha_inicio),
                endDate: formatDate(project.fecha_fin_estimada),
                progress: progress,
                id: project.id_proyecto,
                allRoles: project.roles,
                description: project.descripcion,
              };
            }
          );

          setProjects(transformedProjects);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          "No se pudieron cargar los proyectos. Por favor, intente de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const NewProjectForm: React.FC<{ onSuccess: () => void }> = ({
    onSuccess,
  }) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loadingSkills, setLoadingSkills] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>({
      nombre: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_fin_estimada: "",
      prioridad: 3,
      roles: [],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (
      name: keyof typeof formData,
      value: string | number
    ) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStartDateChange = (date: Date | undefined) => {
      setStartDate(date);
      if (date) {
        // Use format YYYY-MM-DD without time
        setFormData((prev) => ({
          ...prev,
          fecha_inicio: format(date, "yyyy-MM-dd"),
        }));
      }
    };

    const handleEndDateChange = (date: Date | undefined) => {
      setEndDate(date);
      if (date) {
        // Use format YYYY-MM-DD without time
        setFormData((prev) => ({
          ...prev,
          fecha_fin_estimada: format(date, "yyyy-MM-dd"),
        }));
      }
    };
    const addRole = () => {
      setFormData((prev) => ({
        ...prev,
        roles: [
          ...prev.roles,
          {
            titulo: "",
            descripcion: "",
            importancia: 3,
            nivel_experiencia_requerido: 3,
            habilidades: [], // Initialize with an empty array or default skills
          },
        ],
      }));
    };

    // Update a role's property
    // Change your updateRole function to accept both string and number types
    const updateRole = (
      index: number,
      field: keyof ProjectRole,
      value: string | number
    ) => {
      const updatedRoles = [...formData.roles];
      updatedRoles[index] = {
        ...updatedRoles[index],
        [field]: value,
      };
      setFormData((prev) => ({ ...prev, roles: updatedRoles }));
    };

    // Remove a role
    const removeRole = (index: number) => {
      const updatedRoles = [...formData.roles];
      updatedRoles.splice(index, 1);
      setFormData((prev) => ({ ...prev, roles: updatedRoles }));
    };
    useEffect(() => {
      const fetchSkills = async () => {
        try {
          setLoadingSkills(true);
          const token = localStorage.getItem("token");

          const response = await axios.get(
            "http://localhost:4000/api/projects/all-skills",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            setSkills(response.data.skills);
          }
        } catch (err) {
          console.error("Error fetching skills:", err);
        } finally {
          setLoadingSkills(false);
        }
      };

      fetchSkills();
    }, []);

    const addSkillToRole = (roleIndex: number) => {
      const updatedRoles = [...formData.roles];
      if (skills.length > 0) {
        updatedRoles[roleIndex].habilidades.push({
          id_habilidad: skills[0].id_habilidad, // Default to first skill
          nivel_minimo_requerido: 3, // Default values
          importancia: 3,
        });
        setFormData((prev) => ({ ...prev, roles: updatedRoles }));
      }
    };

    const updateSkill = (
      roleIndex: number,
      skillIndex: number,
      field: keyof RoleSkill,
      value: number
    ) => {
      const updatedRoles = [...formData.roles];
      updatedRoles[roleIndex].habilidades[skillIndex] = {
        ...updatedRoles[roleIndex].habilidades[skillIndex],
        [field]: value,
      };
      setFormData((prev) => ({ ...prev, roles: updatedRoles }));
    };

    // Add function to remove a skill from a role
    const removeSkillFromRole = (roleIndex: number, skillIndex: number) => {
      const updatedRoles = [...formData.roles];
      updatedRoles[roleIndex].habilidades.splice(skillIndex, 1);
      setFormData((prev) => ({ ...prev, roles: updatedRoles }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      try {
        // Get the JWT token
        const token = localStorage.getItem("token");

        // Add the current user as manager
        const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
        const projectData = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin_estimada: formData.fecha_fin_estimada,
          prioridad: formData.prioridad, // Already numeric
          id_manager: userInfo.id_persona,
          roles: formData.roles.map((role) => ({
            titulo: role.titulo,
            descripcion: role.descripcion,
            importancia: role.importancia, // Already numeric
            nivel_experiencia_requerido: role.nivel_experiencia_requerido, // Already numeric
            habilidades: role.habilidades.map((skill) => ({
              id_habilidad: skill.id_habilidad,
              nivel_minimo_requerido: skill.nivel_minimo_requerido, // Already numeric
              importancia: skill.importancia, // Already numeric
            })),
          })),
        };

        console.log(
          "Sending data to API:",
          JSON.stringify(projectData, null, 2)
        );

        // Make API call to create project
        const response = await axios.post(
          "http://localhost:4000/api/projects/create-project",
          projectData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Call the onSuccess callback to close dialog and refresh list
          onSuccess();
        } else {
          setError(response.data.message || "Error al crear el proyecto");
        }
      } catch (err) {
        console.error("Error creating project:", err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del proyecto</Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre del proyecto"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describa el proyecto brevemente"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fecha de inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {/* The fix is here - make sure Calendar is correctly imported */}
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Fecha de finalización estimada</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date: Date | undefined) =>
                    handleEndDateChange(date)
                  }
                  initialFocus
                  disabled={(date: Date) =>
                    startDate ? date < startDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prioridad">Prioridad</Label>
            <Select
              value={formData.prioridad.toString()} // Convert to string for the UI
              onValueChange={(value) =>
                handleSelectChange("prioridad", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Baja</SelectItem>
                <SelectItem value="2">Media</SelectItem>
                <SelectItem value="3">Alta</SelectItem>
                <SelectItem value="4">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
                No hay roles definidos. Añade al menos un rol para este
                proyecto.
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
                    <CardTitle className="text-base">
                      Rol #{index + 1}
                    </CardTitle>
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Proyecto"}
          </Button>
        </div>
      </form>
    );
  };
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch = project.project
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchEstado =
        selectedEstado === "Todos" || project.status === selectedEstado;
      return matchSearch && matchEstado;
    });
  }, [projects, searchTerm, selectedEstado]);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading)
    return <div className="p-4 text-center">Cargando proyectos...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [empleadosBanca, setEmpleadosBanca] = useState<UserInfoBanca[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // == THIS IS A HYBRID TEST (REAL DATA + PLACEHOLDER DATA) == //
  const handleAssignClick = async (
    project: string,
    role: string,
    roleId?: number
  ) => {
    setCurrentProject(project);
    setCurrentRole(role);
    setLoading(true);
    setShowAssignDialog(true);

    try {
      const token = localStorage.getItem("token");
      // Usar el roleId pasado como parámetro o buscar en el mapa como fallback
      const actualRoleId = roleId || roleToIdMap[role] || 0;

      if (actualRoleId === 0) {
        console.error(`No se encontró ID para el rol: ${role}`);
        return;
      }

      console.log(`Obteniendo candidatos para el rol ID: ${actualRoleId}`);

      const response = await getBestCandidatesForRole(
        actualRoleId,
        token || ""
      );
      if (response.success && response.candidates) {
        setEmpleadosBanca(response.candidates);
      } else {
        console.error("Error al obtener candidatos:", response.message);
        // Si falla, intentamos fallback a todos los empleados en banca
        const backupResponse = await getEmpleadosBanca(token || "");
        if (backupResponse.success && backupResponse.employees) {
          const employeesArray = Array.isArray(backupResponse.employees)
            ? backupResponse.employees
            : [backupResponse.employees];

          setEmpleadosBanca(employeesArray);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // == THIS IS A HYBRID TEST (REAL DATA + PLACEHOLDER DATA) == //

  const closeAssignDialog = () => {
    setShowAssignDialog(false);
    setCurrentProject("");
    setCurrentRole("");
    setSearchTerm("");
  };

  const assignEmployee = (empleado: UserInfoBanca) => {
    // Aquí se implementaría la lógica para asignar el empleado al rol
    // Por ahora solo se cierra el diálogo
    console.log(
      `Asignando a ${empleado.nombre} ${empleado.apellido} al rol ${currentRole} en el proyecto ${currentProject}`
    );
    setSelectedEmployee(empleado);
    setShowConfirmDialog(true);
  };

  const filteredEmpleados = empleadosBanca.filter((empleado) => {
    const nombreCompleto = empleado.nombre_completo || "";
    const puesto = empleado.puesto_actual || "";

    return (
      nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      puesto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<UserInfoBanca | null>(null);

  // Añade esta función para confirmar la asignación
  const confirmAssignment = () => {
    // Aquí se implementará la lógica real para asignar el empleado al rol
    console.log(
      `Asignando a ${selectedEmployee?.nombre || ""} ${
        selectedEmployee?.apellido || ""
      } al rol ${currentRole} en el proyecto ${currentProject}`
    );
    closeConfirmDialog();
    closeAssignDialog();
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Proyectos
          </h1>
          <p className="text-muted-foreground">
            Administra tus proyectos y asignaciones de roles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 gap-1 bg-primary hover:bg-primary/90"
            onClick={() => setShowNewProjectDialog(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nuevo Proyecto</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar proyectos..."
            className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filtrar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setSelectedEstado("Todos")}>
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedEstado("ACTIVO")}>
              Activos
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedEstado("PLANEACION")}>
              Planeacion
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedEstado("FINALIZADO")}>
              Finalizado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="kanban">Vista Kanban</TabsTrigger>
          <TabsTrigger value="lista">Vista Proyectos</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Roles por Llenar</h3>
                <Badge variant="outline" className="bg-muted">
                  5
                </Badge>
              </div>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">
                      Desarrollador Frontend
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700"
                    >
                      Urgente
                    </Badge>
                  </div>
                  <CardDescription>Proyecto: Sistema CRM</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Fecha inicio:
                      </span>
                      <span>15/04/2025</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duración:</span>
                      <span>3 meses</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ubicación:</span>
                      <span>Remoto</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <User className="h-3.5 w-3.5" />
                          <span>Recomendado: Ana García (85% match)</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          Ana García tiene experiencia en React y ha trabajado
                          en proyectos similares.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    size="sm"
                    className="h-8 bg-primary hover:bg-primary/90"
                    onClick={() =>
                      handleAssignClick(
                        "Sistema CRM",
                        "Desarrollador Frontend",
                        52
                      )
                    }
                  >
                    Asignar
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">DevOps Engineer</CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      Normal
                    </Badge>
                  </div>
                  <CardDescription>
                    Proyecto: Migración a la Nube
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Fecha inicio:
                      </span>
                      <span>01/05/2025</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duración:</span>
                      <span>6 meses</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ubicación:</span>
                      <span>Híbrido</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <User className="h-3.5 w-3.5" />
                          <span>Recomendado: Carlos López (78% match)</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          Carlos López tiene certificaciones en AWS y
                          experiencia en CI/CD.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    size="sm"
                    className="h-8 bg-primary hover:bg-primary/90"
                    onClick={() =>
                      handleAssignClick(
                        "Migración a la Nube",
                        "DevOps Engineer",
                        22
                      )
                    }
                  >
                    Asignar
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Roles Asignados</h3>
                <Badge variant="outline" className="bg-muted">
                  8
                </Badge>
              </div>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">
                      Desarrollador Full Stack
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      Asignado
                    </Badge>
                  </div>
                  <CardDescription>Proyecto: App Móvil Banca</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="Juan Díaz"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Juan Díaz</p>
                        <p className="text-xs text-muted-foreground">
                          Asignado: 10/02/2025
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso:</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Fecha fin: 30/06/2025</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">UI/UX Designer</CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      Asignado
                    </Badge>
                  </div>
                  <CardDescription>
                    Proyecto: Portal de Clientes
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="María Rodríguez"
                        />
                        <AvatarFallback>MR</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">María Rodríguez</p>
                        <p className="text-xs text-muted-foreground">
                          Asignado: 05/01/2025
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso:</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Fecha fin: 10/04/2025</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8">
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Columna: Roles Finalizado */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Roles Finalizado</h3>
                <Badge variant="outline" className="bg-muted">
                  3
                </Badge>
              </div>

              <Card className="border-l-4 border-l-gray-500">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">DevOps Engineer</CardTitle>
                    <Badge variant="outline">Completado</Badge>
                  </div>
                  <CardDescription>
                    Proyecto: Migración a la Nube
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="Pedro Sánchez"
                        />
                        <AvatarFallback>PS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Pedro Sánchez</p>
                        <p className="text-xs text-muted-foreground">
                          Completado: 10/01/2025
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso:</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Duración: 6 meses</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8">
                    Ver informe
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lista" className="space-y-4">
          <div className="rounded-lg border">
            <div className="grid grid-cols-8 gap-4 p-4 font-medium">
              <div className="col-span-2">Proyecto</div>
              <div>Estado</div>
              <div>Fecha inicio</div>
              <div>Fecha fin</div>
              <div>Timeline</div>
              <div>Acciones</div>
            </div>

            {projects.length > 0 ? (
              filteredProjects.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-8 gap-4 border-t p-4 text-sm items-center"
                >
                  <div className="col-span-2">
                    <p className="font-medium">{item.project}</p>
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className={
                        item.status === "Pendiente"
                          ? "bg-yellow-50 text-yellow-700"
                          : item.status === "En progreso"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-700"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <div>{item.startDate}</div>
                  <div>{item.endDate}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Timeline</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        setSelectedProject(item);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No hay proyectos para mostrar.
              </div>
            )}
            {[
              // == THIS IS A HYBRID TEST (REAL DATA + PLACEHOLDER DATA) == //
              {
                project: "Sistema CRM",
                role: "Desarrollador Frontend",
                roleId: 52,
                status: "Pendiente",
                assignedTo: null,
                startDate: "15/04/2025",
                endDate: "15/07/2025",
                progress: 0,
              },
              {
                project: "App Móvil Banca",
                role: "Desarrollador Full Stack",
                roleId: 7,
                status: "En progreso",
                assignedTo: "Juan Díaz",
                startDate: "10/02/2025",
                endDate: "30/06/2025",
                progress: 40,
              },
              {
                project: "Portal de Clientes",
                role: "UI/UX Designer",
                roleId: 9,
                status: "En progreso",
                assignedTo: "María Rodríguez",
                startDate: "05/01/2025",
                endDate: "10/04/2025",
                progress: 85,
              },
              {
                project: "Migración a la Nube",
                role: "DevOps Engineer",
                roleId: 22,
                status: "Completado",
                assignedTo: "Pedro Sánchez",
                startDate: "10/07/2024",
                endDate: "10/01/2025",
                progress: 100,
              },
              // == THIS IS A HYBRID TEST (REAL DATA + PLACEHOLDER DATA) == //
            ].map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-8 gap-4 border-t p-4 text-sm items-center"
              >
                <div className="col-span-2">
                  <p className="font-medium">{item.project}</p>
                  <p className="text-muted-foreground">{item.role}</p>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={
                      item.status === "Pendiente"
                        ? "bg-yellow-50 text-yellow-700"
                        : item.status === "En progreso"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-700"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div>
                  {item.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src="/placeholder.svg?height=24&width=24"
                          alt={item.assignedTo}
                        />
                        <AvatarFallback>
                          {item.assignedTo
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{item.assignedTo}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Sin asignar</span>
                  )}
                </div>
                <div>{item.startDate}</div>
                <div>{item.endDate}</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progreso</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
                <div>
                  <Button variant="ghost" size="sm" className="h-8">
                    Ver detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendario" className="space-y-4">
          <div className="flex h-[400px] items-center justify-center rounded-lg border">
            <div className="text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Vista de Calendario</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                La vista de calendario se implementará próximamente.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        project={selectedProject}
        manager={{
          name: selectedProject?.managerName || "Gerente del Proyecto",
        }}
      />
      <Dialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
          </DialogHeader>

          {/* New Project Form goes here */}
          <div className="grid gap-4 py-4">
            {/* Form fields */}
            <NewProjectForm
              onSuccess={() => {
                setShowNewProjectDialog(false);
                // Refresh your projects list
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewProjectDialog(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de asignación de empleados */}
      <Dialog open={showAssignDialog} onOpenChange={closeAssignDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Asignar empleado a rol</DialogTitle>
            <DialogDescription>
              Selecciona un empleado para el rol {currentRole} en el proyecto{" "}
              {currentProject}
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <p className="mt-2 text-sm text-muted-foreground">
                  Cargando empleados disponibles...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar empleados..."
                  className="w-full rounded-md border border-input bg-white pl-8 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {filteredEmpleados.length > 0 ? (
                  filteredEmpleados
                    .sort((a, b) => {
                      // Extraer solo el número del porcentaje para ordenar
                      const matchA = a.porcentaje_match
                        ? parseFloat(
                            String(a.porcentaje_match).replace("%", "")
                          )
                        : 0;
                      const matchB = b.porcentaje_match
                        ? parseFloat(
                            String(b.porcentaje_match).replace("%", "")
                          )
                        : 0;
                      return matchB - matchA; // Ordenar por mayor porcentaje
                    })
                    .map((empleado) => {
                      const nombreEmpleado =
                        empleado.nombre_completo || "Sin nombre";
                      // Generar iniciales para avatar
                      const iniciales = nombreEmpleado
                        .split(" ")
                        .map((parte) => parte[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase();

                      return (
                        <div
                          key={empleado.id_empleado}
                          className="mb-2 rounded-md border p-3 hover:bg-muted cursor-pointer"
                          onClick={() => assignEmployee(empleado)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{iniciales}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">
                                  {nombreEmpleado}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {empleado.puesto_actual || "Sin puesto"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant="outline"
                                className={
                                  empleado.porcentaje_match &&
                                  empleado.porcentaje_match >= 80
                                    ? "bg-green-50 text-green-700"
                                    : empleado.porcentaje_match &&
                                      empleado.porcentaje_match >= 70
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-yellow-50 text-yellow-700"
                                }
                              >
                                {empleado.porcentaje_match || "0%"}
                              </Badge>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Disponibilidad:{" "}
                                {empleado.porcentaje_disponibilidad || "0%"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <User className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">
                      No hay empleados disponibles
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      No se encontraron empleados que coincidan con la búsqueda.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={closeAssignDialog}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={closeConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar asignación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas asignar a{" "}
              {selectedEmployee
                ? selectedEmployee.nombre && selectedEmployee.apellido
                  ? `${selectedEmployee.nombre} ${selectedEmployee.apellido}`
                  : selectedEmployee.nombre_completo || "Sin nombre"
                : ""}
              al rol {currentRole} en el proyecto {currentProject}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={closeConfirmDialog}>
              Cancelar
            </Button>
            <Button onClick={confirmAssignment}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
