import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { formatDate } from "@/lib/functions";
import { CoursesUserResponse, CoursesUser } from "@/types/users";

function CoursesCompleted({
  getFilteredCourses,
  userCourses,
}: {
  getFilteredCourses: (
    courses: CoursesUserResponse | undefined,
    completed: boolean
  ) => CoursesUser[];
  userCourses: CoursesUserResponse | undefined;
}) {
  return (
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
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Categoría
                    </span>
                    <p className="font-medium">{course.categoria}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Duración
                    </span>
                    <p className="font-medium">{course.duracion} horas</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Fecha completado
                    </span>
                    <p className="font-medium">
                      {formatDate(course.fecha_finalizacion)}
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
  );
}

export default CoursesCompleted;
