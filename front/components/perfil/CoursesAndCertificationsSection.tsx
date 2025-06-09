"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin, Award, GraduationCap, Clock, Building } from "lucide-react";
import type { CertificationsUserResponse, CoursesUserResponse } from "@/types/users";
import { formatDate } from "@/lib/functions";

interface CoursesAndCertificationsSectionProps {
  courses: CoursesUserResponse | null;
  certifications: CertificationsUserResponse | null;
}

export default function CoursesAndCertificationsSection({
                                                          courses,
                                                          certifications,
                                                        }: CoursesAndCertificationsSectionProps) {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cursos */}
        <Card className="border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              Cursos ({courses?.courses?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80"> {/* Altura fija */}
              <ScrollArea className="h-full p-6">
                {courses?.courses && courses.courses.length > 0 ? (
                    <div className="space-y-4">
                      {courses.courses.map((course, index) => (
                          <div key={index} className="border border-purple-100 rounded-lg p-4 bg-gradient-to-r from-purple-25 to-blue-25 hover:shadow-md transition-shadow">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-purple-900 text-sm">
                                  {course.nombre}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Building className="h-3 w-3 text-purple-600" />
                                  <span className="text-xs text-purple-700">
                              {course.institucion}
                            </span>
                                </div>
                              </div>

                              {course.descripcion && (
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {course.descripcion}
                                  </p>
                              )}

                              <div className="flex flex-wrap gap-2">
                                {course.modalidad && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                      {course.modalidad}
                                    </Badge>
                                )}
                                {course.categoria && (
                                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                      {course.categoria}
                                    </Badge>
                                )}
                                {course.progreso && (
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                      {course.progreso}
                                    </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(course.fecha_inicio)}</span>
                                </div>
                                {course.duracion && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{course.duracion}h</span>
                                    </div>
                                )}
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">No hay cursos registrados</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Los cursos aparecerán aquí cuando se agreguen
                      </p>
                    </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Certificaciones */}
        <Card className="border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Award className="h-5 w-5 text-purple-600" />
              Certificaciones ({certifications?.certifications?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80"> {/* Altura fija */}
              <ScrollArea className="h-full p-6">
                {certifications?.certifications && certifications.certifications.length > 0 ? (
                    <div className="space-y-4">
                      {certifications.certifications.map((cert, index) => (
                          <div key={index} className="border border-purple-100 rounded-lg p-4 bg-gradient-to-r from-purple-25 to-blue-25 hover:shadow-md transition-shadow">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-purple-900 text-sm">
                                  {cert.Nombre}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Building className="h-3 w-3 text-purple-600" />
                                  <span className="text-xs text-purple-700">
                              {cert.Institucion}
                            </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {cert.Nivel && (
                                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                      Nivel {cert.Nivel}
                                    </Badge>
                                )}
                                {cert.Validez && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                      {cert.Validez} meses
                                    </Badge>
                                )}
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  {cert.estado_validacion ? 'Válida' : 'Pendiente'}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Obtenida: {formatDate(cert.fecha_obtencion)}</span>
                                </div>
                              </div>

                              {cert.fecha_vencimiento && (
                                  <div className="flex items-center gap-1 text-xs text-orange-600">
                                    <Calendar className="h-3 w-3" />
                                    <span>Vence: {formatDate(cert.fecha_vencimiento)}</span>
                                  </div>
                              )}
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Award className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">No hay certificaciones registradas</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Las certificaciones aparecerán aquí cuando se agreguen
                      </p>
                    </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}