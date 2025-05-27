import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { CoursesUserResponse, CertificationsUserResponse } from "@/types/users";

function CoursesAndCertificationsSection({
  courses,
  certifications,
}: {
  courses: CoursesUserResponse | null;
  certifications: CertificationsUserResponse | null;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Cursos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {courses && courses.courses.length > 0 ? (
              courses.courses.map((course, index) => (
                <div key={`course-${course.id_curso}-${index}`} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{course.nombre}</h4>
                    <span className="text-xs text-muted-foreground">
                      {course.modalidad}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {course.institucion}
                  </p>
                </div>
              ))
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  No hay cursos disponibles
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Certificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {certifications && certifications.certifications.length > 0 ? (
              certifications.certifications.map((cert, index) => (
                <div key={`cert-${cert.ID_Certificacion}-${index}`} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{cert.Nombre}</h4>
                    <span className="text-xs text-muted-foreground">
                      {cert.Validez}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cert.Institucion}
                  </p>
                </div>
              ))
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  No hay certificaciones disponibles
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CoursesAndCertificationsSection;
