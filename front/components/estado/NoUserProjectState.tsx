import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

function NoUserProjectState({ router }: { router: any }) {
  return (
    <Card className="border-none shadow-md">
      <div className="flex items-center gap-2 pt-4 pb-2 px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a usuarios</span>
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Información del rol del empleado
        </CardTitle>
      </CardHeader>

      <CardContent className="text-center py-8">
        <p className="text-lg text-gray-600">
          Este empleado no está asignado a ningún proyecto actualmente.
        </p>
      </CardContent>
    </Card>
  );
}

export default NoUserProjectState;
