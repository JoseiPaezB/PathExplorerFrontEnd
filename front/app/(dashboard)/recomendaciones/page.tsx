"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Importar hooks personalizados
import { useFetchRecommendations } from "@/hooks/useFetchRecommendations";
import { useFetchRecommendedRoles } from "@/hooks/useFetchRecommendedRoles";
import { useFetchCoursesAndCerts } from "@/hooks/useFetchCoursesAndCerts";

// Definir tipos locales para esta página
interface Trayectoria {
  nombre: string;
  descripcion: string;
  roles_secuenciales: string;
  tiempo_estimado: number;
  compatibilidad?: number;
}

interface Skill {
  id_habilidad: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  nivel_minimo_requerido: number;
  importancia: string;
}

interface Manager {
  id_persona: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  estado: string;
}

interface Role {
  id_rol: number;
  titulo: string;
  descripcion: string;
  nivel_experiencia_requerido: string;
  id_proyecto: number;
  id_manager: number;
  skills?: Skill[];
  manager?: Manager[];
  project?: Project[];
}

interface RecommendedRole {
  id_rol: number;
  titulo: string;
  descripcion: string;
  compatibilidad: number;
  roleWithProject: Role;
}

interface Course {
  id_curso?: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  proveedor: string;
  duracion: string;
  nivel: string;
  formato: string;
  habilidades?: string[];
  compatibilidad?: number;
}

interface Certification {
  id_certificacion?: number;
  nombre: string;
  descripcion: string;
  entidad_emisora: string;
  validez: string;
  nivel: string;
  tipo: string;
  habilidades?: string[];
  compatibilidad?: number;
}

interface CoursesAndCertsData {
  cursos_recomendados: Course[];
  certificaciones_recomendadas: Certification[];
}

interface RecommendationsData {
  trayectorias_recomendadas: Trayectoria[];
}

function Page() {
  const { toast } = useToast();
  
  // Estado para los filtros de selección
  const [projectStates] = useState<string[]>([
    "PLANIFICACION",
    "EN_PROGRESO",
    "FINALIZADO",
    "PAUSADO"
  ]);
  
  const [skillCategories] = useState<string[]>([
    "TECNICA",
    "BLANDA",
    "LIDERAZGO",
    "GESTION",
    "DOMINIO"
  ]);

  // Utilizar hooks personalizados
  const { 
    recommendations, 
    isLoading: isLoadingRecommendations, 
    error: recommendationsError 
  } = useFetchRecommendations();
  
  const {
    recommendedRoles,
    isLoading: isLoadingRoles,
    error: rolesError,
    fetchRecommendedRoles,
    filters: rolesFilters,
    setFilters: setRolesFilters,
  } = useFetchRecommendedRoles();
  
  const {
    coursesAndCerts,
    isLoading: isLoadingCoursesAndCerts,
    error: coursesAndCertsError,
    fetchCoursesAndCerts,
    filters: coursesAndCertsFilters,
    setFilters: setCoursesAndCertsFilters,
  } = useFetchCoursesAndCerts();

  // Función para aplicar filtros en roles recomendados
  const applyRolesFilters = (key: string, value: string) => {
    const newFilters = { ...rolesFilters, [key]: value };
    fetchRecommendedRoles(newFilters);
  };

  // Función para aplicar filtros en cursos y certificaciones
  const applyCoursesAndCertsFilters = (key: string, value: string) => {
    const newFilters = { ...coursesAndCertsFilters, [key]: value };
    fetchCoursesAndCerts(newFilters);
  };

  // Convertir recommendations a tipo tipado
  const typedRecommendations = recommendations as RecommendationsData | null;
  const typedCoursesAndCerts = coursesAndCerts as CoursesAndCertsData | null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recomendaciones</h1>
        <p className="text-muted-foreground">
          Descubre oportunidades personalizadas para tu desarrollo profesional
        </p>
      </div>

      <Tabs defaultValue="trayectoria" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trayectoria">Trayectoria</TabsTrigger>
          <TabsTrigger value="roles">Roles Recomendados</TabsTrigger>
          <TabsTrigger value="cursos">Cursos y Certificaciones</TabsTrigger>
        </TabsList>
        
        {/* TAB: Trayectoria Recomendada */}
        <TabsContent value="trayectoria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trayectorias Recomendadas</CardTitle>
              <CardDescription>
                Basado en tu perfil, experiencia y habilidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRecommendations ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-slate-200 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : recommendationsError ? (
                <div className="text-red-500">
                  <p>Error al cargar recomendaciones: {recommendationsError}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    className="mt-2"
                  >
                    Reintentar
                  </Button>
                </div>
              ) : typedRecommendations ? (
                <div className="space-y-6">
                  {typedRecommendations.trayectorias_recomendadas && typedRecommendations.trayectorias_recomendadas.map((trayectoria: Trayectoria, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{trayectoria.nombre}</h3>
                          <p className="text-sm text-gray-500 mt-1">{trayectoria.descripcion}</p>
                        </div>
                        <Badge variant={index === 0 ? "default" : "outline"}>
                          {index === 0 ? "Recomendado" : `Opción ${index + 1}`}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Roles secuenciales:</p>
                          <p className="text-sm">{trayectoria.roles_secuenciales}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Tiempo estimado:</p>
                          <p className="text-sm">{trayectoria.tiempo_estimado} meses</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">Compatibilidad con tu perfil:</p>
                        <div className="flex items-center gap-2">
                          <Progress value={trayectoria.compatibilidad || 85} className="h-2" />
                          <span className="text-sm font-medium">{trayectoria.compatibilidad || 85}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            toast({
                              title: "Acción no disponible",
                              description: "Dirígete a la sección de Trayectoria para seleccionar esta opción.",
                              variant: "default",
                            });
                          }}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {(!typedRecommendations.trayectorias_recomendadas || typedRecommendations.trayectorias_recomendadas.length === 0) && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No hay trayectorias recomendadas disponibles.</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Completa tu perfil para recibir recomendaciones personalizadas.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay datos disponibles.</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    className="mt-2"
                  >
                    Reintentar
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/trayectoria"}
              >
                Ver mi trayectoria actual
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* TAB: Roles Recomendados */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Roles Recomendados</CardTitle>
                  <CardDescription>
                    Posiciones que se alinean con tus habilidades y experiencia
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select 
                    value={rolesFilters.roleState} 
                    onValueChange={(value: string) => applyRolesFilters("roleState", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Estado del proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los estados</SelectItem>
                      {projectStates.map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={rolesFilters.roleSkills} 
                    onValueChange={(value: string) => applyRolesFilters("roleSkills", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoría de habilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las categorías</SelectItem>
                      {skillCategories.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRoles ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-slate-200 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : rolesError ? (
                <div className="text-red-500">
                  <p>Error al cargar roles recomendados: {rolesError}</p>
                  <Button 
                    onClick={() => fetchRecommendedRoles()} 
                    variant="outline" 
                    className="mt-2"
                  >
                    Reintentar
                  </Button>
                </div>
              ) : recommendedRoles && recommendedRoles.length > 0 ? (
                <div className="space-y-6">
                  {recommendedRoles.map((role: RecommendedRole, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{role.roleWithProject?.titulo || "Rol sin título"}</h3>
                            <Badge variant={role.roleWithProject?.project?.[0]?.estado === "EN_PROGRESO" ? "default" : "outline"}>
                              {role.roleWithProject?.project?.[0]?.estado?.replace("_", " ") || "Estado desconocido"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{role.roleWithProject?.descripcion}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Compatibilidad: {role.compatibilidad || 85}%</Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Proyecto:</p>
                          <p className="text-sm">{role.roleWithProject?.project?.[0]?.nombre || "Sin proyecto asignado"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Manager:</p>
                          <p className="text-sm">
                            {role.roleWithProject?.manager?.[0]?.nombre 
                              ? `${role.roleWithProject.manager[0].nombre} ${role.roleWithProject.manager[0].apellido}` 
                              : "Sin manager asignado"}
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Habilidades requeridas:</p>
                        <div className="flex flex-wrap gap-2">
                          {role.roleWithProject?.skills?.slice(0, 5).map((skill: Skill, idx: number) => (
                            <Badge key={idx} variant="outline" className="bg-slate-50">
                              {skill.nombre} {skill.nivel_minimo_requerido ? `(Nivel ${skill.nivel_minimo_requerido})` : ""}
                            </Badge>
                          ))}
                          {(role.roleWithProject?.skills?.length || 0) > 5 && (
                            <Badge variant="outline">+{(role.roleWithProject?.skills?.length || 0) - 5} más</Badge>
                          )}
                          {(!role.roleWithProject?.skills || role.roleWithProject.skills.length === 0) && (
                            <span className="text-sm text-gray-400">No hay habilidades especificadas</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Función en desarrollo",
                              description: "La función para aplicar a roles estará disponible próximamente.",
                              variant: "default",
                            });
                          }}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay roles recomendados disponibles.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Esto puede deberse a los filtros aplicados o a que no hay roles abiertos que coincidan con tu perfil.
                  </p>
                  <Button 
                    onClick={() => fetchRecommendedRoles({})} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Quitar filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* TAB: Cursos y Certificaciones */}
        <TabsContent value="cursos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Cursos y Certificaciones Recomendados</CardTitle>
                  <CardDescription>
                    Formación sugerida para potenciar tu desarrollo profesional
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select 
                    value={coursesAndCertsFilters.coursesCategory} 
                    onValueChange={(value: string) => applyCoursesAndCertsFilters("coursesCategory", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las categorías</SelectItem>
                      <SelectItem value="DESARROLLO_WEB">Desarrollo Web</SelectItem>
                      <SelectItem value="CIENCIA_DATOS">Ciencia de Datos</SelectItem>
                      <SelectItem value="CLOUD">Cloud Computing</SelectItem>
                      <SelectItem value="SEGURIDAD">Seguridad</SelectItem>
                      <SelectItem value="LIDERAZGO">Liderazgo</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={coursesAndCertsFilters.coursesProvider} 
                    onValueChange={(value: string) => applyCoursesAndCertsFilters("coursesProvider", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los proveedores</SelectItem>
                      <SelectItem value="UDEMY">Udemy</SelectItem>
                      <SelectItem value="COURSERA">Coursera</SelectItem>
                      <SelectItem value="PLURALSIGHT">Pluralsight</SelectItem>
                      <SelectItem value="LINKEDIN_LEARNING">LinkedIn Learning</SelectItem>
                      <SelectItem value="EDX">edX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingCoursesAndCerts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-slate-200 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : coursesAndCertsError ? (
                <div className="text-red-500">
                  <p>Error al cargar cursos y certificaciones: {coursesAndCertsError}</p>
                  <Button 
                    onClick={() => fetchCoursesAndCerts()} 
                    variant="outline" 
                    className="mt-2"
                  >
                    Reintentar
                  </Button>
                </div>
              ) : typedCoursesAndCerts ? (
                <div>
                  {/* Sección de Cursos */}
                  {typedCoursesAndCerts.cursos_recomendados && typedCoursesAndCerts.cursos_recomendados.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">Cursos Recomendados</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {typedCoursesAndCerts.cursos_recomendados.map((curso: Course, index: number) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="bg-primary h-1"></div>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{curso.nombre}</CardTitle>
                                <Badge variant="outline" className="font-normal">
                                  {curso.categoria || "Sin categoría"}
                                </Badge>
                              </div>
                              <CardDescription className="line-clamp-2">
                                {curso.descripcion}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div>
                                  <Label className="text-xs font-normal text-gray-500">Proveedor</Label>
                                  <p>{curso.proveedor || "No especificado"}</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-normal text-gray-500">Duración</Label>
                                  <p>{curso.duracion || "No especificada"}</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-normal text-gray-500">Nivel</Label>
                                  <p className="capitalize">{curso.nivel?.toLowerCase() || "No especificado"}</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-normal text-gray-500">Formato</Label>
                                  <p className="capitalize">{curso.formato?.toLowerCase() || "No especificado"}</p>
                                </div>
                              </div>
                              
                              {curso.habilidades && curso.habilidades.length > 0 && (
                                <div className="mt-3">
                                  <Label className="text-xs font-normal text-gray-500">Habilidades</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {curso.habilidades.slice(0, 3).map((habilidad: string, idx: number) => (
                                      <Badge key={idx} variant="secondary" className="font-normal text-xs">
                                        {habilidad}
                                      </Badge>
                                    ))}
                                    {curso.habilidades.length > 3 && (
                                      <Badge variant="outline" className="text-xs">+{curso.habilidades.length - 3}</Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="pt-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  toast({
                                    title: "Función en desarrollo",
                                    description: "La inscripción a cursos estará disponible próximamente.",
                                    variant: "default",
                                  });
                                }}
                              >
                                Ver detalles
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Sección de Certificaciones */}
                  {typedCoursesAndCerts.certificaciones_recomendadas && typedCoursesAndCerts.certificaciones_recomendadas.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Certificaciones Recomendadas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {typedCoursesAndCerts.certificaciones_recomendadas.map((cert: Certification, index: number) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="bg-secondary h-1"></div>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{cert.nombre}</CardTitle>
                                <Badge variant="outline" className="font-normal">
                                  {cert.entidad_emisora || "Sin entidad emisora"}
                                </Badge>
                              </div>
                              <CardDescription className="line-clamp-2">
                                {cert.descripcion}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div>
                                  <Label className="text-xs font-normal text-gray-500">Entidad emisora</Label>
                                  <p>{cert.entidad_emisora || "No especificada"}</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-normal text-gray-500">Validez</Label>
                                  <p>{cert.validez || "No especificada"}</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-normal text-gray-500">Nivel</Label>
                                  <p className="capitalize">{cert.nivel?.toLowerCase() || "No especificado"}</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-normal text-gray-500">Tipo</Label>
                                  <p className="capitalize">{cert.tipo?.toLowerCase() || "No especificado"}</p>
                                </div>
                              </div>
                              
                              {cert.habilidades && cert.habilidades.length > 0 && (
                                <div className="mt-3">
                                  <Label className="text-xs font-normal text-gray-500">Habilidades</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {cert.habilidades.slice(0, 3).map((habilidad: string, idx: number) => (
                                      <Badge key={idx} variant="secondary" className="font-normal text-xs">
                                        {habilidad}
                                      </Badge>
                                    ))}
                                    {cert.habilidades.length > 3 && (
                                      <Badge variant="outline" className="text-xs">+{cert.habilidades.length - 3}</Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="pt-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  toast({
                                    title: "Función en desarrollo",
                                    description: "La información detallada sobre certificaciones estará disponible próximamente.",
                                    variant: "default",
                                 });
                               }}
                             >
                               Ver detalles
                             </Button>
                           </CardFooter>
                         </Card>
                       ))}
                     </div>
                   </div>
                 )}
                 
                 {/* Si no hay datos para mostrar */}
                 {(!typedCoursesAndCerts.cursos_recomendados || typedCoursesAndCerts.cursos_recomendados.length === 0) && 
                  (!typedCoursesAndCerts.certificaciones_recomendadas || typedCoursesAndCerts.certificaciones_recomendadas.length === 0) && (
                   <div className="text-center py-8">
                     <p className="text-gray-500">No hay cursos o certificaciones recomendados disponibles.</p>
                     <p className="text-sm text-gray-400 mt-1">
                       Esto puede deberse a los filtros aplicados o a que no hay opciones que coincidan con tu perfil.
                     </p>
                     <Button 
                       onClick={() => fetchCoursesAndCerts({})} 
                       variant="outline" 
                       className="mt-4"
                     >
                       Quitar filtros
                     </Button>
                   </div>
                 )}
               </div>
             ) : (
               <div className="text-center py-8">
                 <p className="text-gray-500">No hay datos disponibles.</p>
                 <Button 
                   onClick={() => fetchCoursesAndCerts()} 
                   variant="outline" 
                   className="mt-2"
                 >
                   Reintentar
                 </Button>
               </div>
             )}
           </CardContent>
           <CardFooter className="flex justify-end">
             <Button 
               variant="outline" 
               onClick={() => window.location.href = "/cursos-y-certificaciones"}
             >
               Ver todos los cursos y certificaciones
             </Button>
           </CardFooter>
         </Card>
       </TabsContent>
     </Tabs>
   </div>
 );
}

export default Page;