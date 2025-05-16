"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateTrajectoryForm from "@/components/trayectoria/CreateTrajectoryForm";
import { fetchTrayectory } from "@/hooks/fetchTrayectory";
import { fetchGetTrayectoriesByRole } from "@/hooks/fetchGetTrayectoriesByRole";
import { useAddTrayectory } from "@/hooks/useAddTrayectory";

function page() {
  const { trayectory, isLoading, error } = fetchTrayectory();

  const hasTrajectory = !!trayectory;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trayectoria</CardTitle>
        <CardDescription>
          {hasTrajectory
            ? "Ya tienes una trayectoria registrada"
            : "No tienes una trayectoria registrada"}
          {/* Si no tiene trayectoria aqui se hace el fetch a fetchGetTrayectoriesByRole */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasTrajectory ? (
          <p>Detalles de la trayectoria...</p>
        ) : (
          <CreateTrajectoryForm />
        )}
      </CardContent>
    </Card>
  );
}

export default page;
