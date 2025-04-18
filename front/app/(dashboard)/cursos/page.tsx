"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  GraduationCap,
  Plus,
  Search,
  Timer,
} from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { CoursesUserResponse, CertificationsUserResponse } from "@/types/users";

export default function CursosPage() {
  const [activeTab, setActiveTab] = useState("en-curso");
  const [userCourses, setUserCourses] = useState<CoursesUserResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCertifications, setUserCertifications] =
    useState<CertificationsUserResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const { courses, certifications } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const coursesData = await courses();

        if (coursesData) {
          setUserCourses(coursesData);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [courses]);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setIsLoading(true);
        const certificationsData = await certifications();

        if (certificationsData) {
          setUserCertifications(certificationsData);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching certifications:", err);
        setError("Failed to load certifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertifications();
  }, [certifications]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const getFilteredCourses = (
    courses: CoursesUserResponse | undefined,
    completed = false
  ) => {
    if (!courses?.courses) return [];

    return courses.courses.filter((course) => {
      const completionMatch = completed
        ? !!course.calificacion
        : !course.calificacion;

      const searchMatch =
        searchTerm === "" ||
        course.nombre.toLowerCase().includes(searchTerm) ||
        course.descripcion.toLowerCase().includes(searchTerm);

      return completionMatch && searchMatch;
    });
  };

  const getFilteredCertifications = () => {
    if (!userCertifications?.certifications) return [];

    return userCertifications.certifications.filter(
      (cert) =>
        searchTerm === "" ||
        cert.Nombre.toLowerCase().includes(searchTerm) ||
        cert.Institucion.toLowerCase().includes(searchTerm)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Cursos y Certificaciones
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu desarrollo profesional y mantén tus certificaciones al
            día
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/cursos/agregar-curso">
            <Button
              size="sm"
              className="h-8 gap-1 bg-primary hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nuevo Curso</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Buscar ${
              activeTab === "certificaciones" ? "certificaciones" : "cursos"
            }...`}
            className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setSearchTerm("");
        }}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="en-curso">En Curso</TabsTrigger>
          <TabsTrigger value="completados">Completados</TabsTrigger>
          <TabsTrigger value="certificaciones">Certificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="en-curso" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredCourses(userCourses, false)
              .filter((course) => {
                return !course.calificacion;
              })
              .map((course, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      {isLoading && (
                        <div className="text-center">Loading courses...</div>
                      )}
                      {error && (
                        <div className="text-red-500 text-center">
                          Error: {error}
                        </div>
                      )}
                      <div className="space-y-1">
                        <CardTitle>{course.nombre}</CardTitle>
                        <CardDescription>{course.descripcion}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Timer className="h-4 w-4" />
                        <span>Duración: {course.duracion}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completados" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredCourses(userCourses, true)
              .filter((course) => {
                return course.calificacion;
              })
              .map((course, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{course.nombre}</CardTitle>
                        <CardDescription>{course.descripcion}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-muted">
                        Completado
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Duración
                        </span>
                        <p className="font-medium">{course.duracion}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Fecha completado
                        </span>
                        <p className="font-medium">
                          {course.fecha_finalizacion}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Calificación
                        </span>
                        <p className="font-medium">{course.calificacion}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="outline" className="w-full gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Ver certificado
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="certificaciones" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredCertifications().map((cert, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{cert.Nombre}</CardTitle>
                      <CardDescription>{cert.Institucion}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        cert.estado_validacion
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }
                    >
                      {cert.estado_validacion}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Válida hasta:
                      </span>
                      <span className="font-medium">
                        {cert.fecha_vencimiento}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        ID Credencial:
                      </span>
                      <span className="font-medium">
                        {cert.ID_Certificacion}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 border-t pt-4">
                  <Button variant="outline" className="gap-2">
                    <Award className="h-4 w-4" />
                    Ver credencial
                  </Button>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <BookOpen className="h-4 w-4" />
                    Renovar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
