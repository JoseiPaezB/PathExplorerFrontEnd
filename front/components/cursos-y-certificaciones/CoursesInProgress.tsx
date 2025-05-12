import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { School, Timer, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CoursesUserResponse, CoursesUser } from "@/types/users";

function CoursesInProgress({
  getFilteredCourses,
  courses,
}: {
  getFilteredCourses: (
    courses: CoursesUserResponse | undefined,
    completed: boolean
  ) => CoursesUser[];
  courses: CoursesUserResponse | undefined;
}) {
  return (
    <TabsContent value="en-curso" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {getFilteredCourses(courses, false)
          .filter((course) => {
            return !course.calificacion;
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{course.categoria}</Badge>
                    <span className="font-medium">
                      {course.progreso}% completado
                    </span>
                  </div>
                  <Progress
                    value={parseFloat(course.progreso)}
                    className="h-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <School className="h-4 w-4" />
                    <span>Institucion: {course.institucion}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span>Duración: {course.duracion} horas</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Modalidad: {course.modalidad}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Link
                  href={`/cursos-y-certificaciones/editar/${course.id_curso}`}
                  className="w-full"
                  onClick={() =>
                    sessionStorage.setItem(
                      "courseToEdit",
                      JSON.stringify(course)
                    )
                  }
                >
                  <Button variant="outline" className="w-full gap-2">
                    <Edit className="h-4 w-4" />
                    Editar curso
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
      </div>
    </TabsContent>
  );
}

export default CoursesInProgress;
