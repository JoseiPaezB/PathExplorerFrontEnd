import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, User } from "lucide-react";
import { SkillsResponse } from "@/types/users";

function SkillsSection({ skills }: { skills: SkillsResponse | null }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Habilidades Técnicas
          </CardTitle>
          <CardDescription>
            Evaluación de competencias técnicas basada en proyectos y
            certificaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skills && skills.skills.length > 0 ? (
              skills.skills
                .filter((skill) => skill.categoria === "TECNICA")
                .map((skill, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {skill.nombre}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {skill.nivel_demostrado}
                      </span>
                    </div>
                    <Progress
                      value={skill.nivel_demostrado * 20}
                      className="h-2"
                    />
                  </div>
                ))
            ) : (
              <p>No hay habilidades técnicas disponibles</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Habilidades Blandas
          </CardTitle>
          <CardDescription>
            Evaluación de competencias interpersonales basada en feedback de
            equipo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skills && skills.skills.length > 0 ? (
              skills.skills
                .filter((skill) => skill.categoria === "BLANDA")
                .map((skill, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {skill.nombre}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {skill.nivel_demostrado}
                      </span>
                    </div>
                    <Progress
                      value={skill.nivel_demostrado * 20}
                      className="h-2"
                    />
                  </div>
                ))
            ) : (
              <p>No hay habilidades técnicas disponibles</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SkillsSection;
