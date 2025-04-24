"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Clock, Download, Filter, Plus, Search, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import axios from 'axios';
import { useEffect } from "react"
import { getManagerProjects, formatDate } from './projectService'; // Adjust the import path as necessary
import ProjectDetailsModal from './projectDetails';



export default function ProyectosPage() {
  const [activeTab, setActiveTab] = useState("kanban")
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState<TransformedProject | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  interface Role {
    id_rol: number;
    titulo: string;
    descripcion: string;
    assignments: Assignment[];
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

  const [projects, setProjects] = useState<TransformedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      }
      
      interface Assignment {
        nombre: string;
        apellido: string;
      }
      
      try {
        setLoading(true);
        // Get the JWT token from localStorage or your auth context
        const token = localStorage.getItem('token');
        
        // Make API call to fetch manager projects
        const response = await axios.get('http://localhost:4000/api/projects/manager-projects-with-roles', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userInfoRaw = localStorage.getItem('user');
        console.log('All localStorage keys:', Object.keys(localStorage));
        const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Raw userInfo from localStorage:', userInfoRaw);
        console.log('Parsed userInfo:', userInfo);
        const managerName = userInfo.nombre && userInfo.apellido 
          ? `${userInfo.nombre} ${userInfo.apellido}` 
          : "Gerente Actual";

        if (response.data.success && response.data.hasProjects) {
          // Transform the backend data to match the frontend format
          const transformedProjects = response.data.managerProjects.map((project: Project) => {
            // Calculate progress based on project status or other metrics
            let progress = 0;
            if (project.estado === 'Completado') {
              progress = 100;
            } else if (project.estado === 'En progreso') {
              // You could calculate this based on dates or other metrics
              const startDate = new Date(project.fecha_inicio);
              const endDate = new Date(project.fecha_fin_estimada);
              const today = new Date();
              
              const totalDuration = endDate.getTime() - startDate.getTime();
              const elapsed = today.getTime() - startDate.getTime();
              
              progress = Math.min(Math.round((elapsed / totalDuration) * 100), 99);
            }

            // Get the first assignment for each role (if any)
            const assignedPersons = project.roles.flatMap(role => 
              role.assignments.map(assignment => ({
                roleTitulo: role.titulo,
                roleId: role.id_rol,
                ...assignment
              }))
            );

            return {
              managerName: managerName,
              project: project.nombre,
              role: project.roles.length > 0 ? project.roles[0].titulo : "Multiple Roles",
              status: project.estado || "Pendiente",
              assignedTo: assignedPersons.length > 0 ? `${assignedPersons[0].nombre} ${assignedPersons[0].apellido}` : null,
              startDate: formatDate(project.fecha_inicio),
              endDate: formatDate(project.fecha_fin_estimada),
              progress: progress,
              id: project.id_proyecto,
              allRoles: project.roles,
              description: project.descripcion
            };
          });

          setProjects(transformedProjects);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("No se pudieron cargar los proyectos. Por favor, intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) return <div className="p-4 text-center">Cargando proyectos...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">Administra tus proyectos y asignaciones de roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrar</span>
          </Button>
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
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>Estado</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Todos</DropdownMenuItem>
            <DropdownMenuItem>Activos</DropdownMenuItem>
            <DropdownMenuItem>Pendientes</DropdownMenuItem>
            <DropdownMenuItem>Completados</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>Departamento</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por departamento</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Todos</DropdownMenuItem>
            <DropdownMenuItem>Tecnología</DropdownMenuItem>
            <DropdownMenuItem>Marketing</DropdownMenuItem>
            <DropdownMenuItem>Ventas</DropdownMenuItem>
            <DropdownMenuItem>Recursos Humanos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban">Vista Kanban</TabsTrigger>
          <TabsTrigger value="lista">Vista Proyectos</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Columna: Roles por Llenar */}
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
                    <CardTitle className="text-base">Desarrollador Frontend</CardTitle>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Urgente
                    </Badge>
                  </div>
                  <CardDescription>Proyecto: Sistema CRM</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fecha inicio:</span>
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
                          Ana García tiene experiencia en React y ha trabajado en proyectos similares.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button size="sm" className="h-8 bg-primary hover:bg-primary/90">
                    Asignar
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">DevOps Engineer</CardTitle>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Normal
                    </Badge>
                  </div>
                  <CardDescription>Proyecto: Migración a la Nube</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fecha inicio:</span>
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
                        <p className="text-xs">Carlos López tiene certificaciones en AWS y experiencia en CI/CD.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button size="sm" className="h-8 bg-primary hover:bg-primary/90">
                    Asignar
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Columna: Roles Asignados */}
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
                    <CardTitle className="text-base">Desarrollador Full Stack</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Asignado
                    </Badge>
                  </div>
                  <CardDescription>Proyecto: App Móvil Banca</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Juan Díaz" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Juan Díaz</p>
                        <p className="text-xs text-muted-foreground">Asignado: 10/02/2025</p>
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8"
                  >
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">UI/UX Designer</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Asignado
                    </Badge>
                  </div>
                  <CardDescription>Proyecto: Portal de Clientes</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="María Rodríguez" />
                        <AvatarFallback>MR</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">María Rodríguez</p>
                        <p className="text-xs text-muted-foreground">Asignado: 05/01/2025</p>
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

            {/* Columna: Roles Completados */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Roles Completados</h3>
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
                  <CardDescription>Proyecto: Migración a la Nube</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Pedro Sánchez" />
                        <AvatarFallback>PS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Pedro Sánchez</p>
                        <p className="text-xs text-muted-foreground">Completado: 10/01/2025</p>
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
              projects.map((item, index) => (
                <div key={index} className="grid grid-cols-8 gap-4 border-t p-4 text-sm items-center">
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
          </div>
        </TabsContent>

        <TabsContent value="calendario" className="space-y-4">
          <div className="flex h-[400px] items-center justify-center rounded-lg border">
            <div className="text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Vista de Calendario</h3>
              <p className="mt-2 text-sm text-muted-foreground">La vista de calendario se implementará próximamente.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <ProjectDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        project={selectedProject}
        manager={{ name: selectedProject?.managerName || "Gerente del Proyecto" }}
      />
    </div>
  )
}

