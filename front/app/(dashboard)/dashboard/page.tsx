"use client";

import { useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/contexts/auth-context";
import EmployeeDashboard from "@/components/dashboard/EmplyeeDashboard";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Loading shimmer card component
const ShimmerCard = () => (
  <div className="rounded-xl border border-border/50 bg-card/50 shadow-sm overflow-hidden">
    <div className="p-6 space-y-4">
      <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse" />
      <div className="h-4 w-2/3 rounded-md bg-muted/80 animate-pulse" />
      <div className="h-32 rounded-md bg-muted/60 animate-pulse" />
    </div>
    <div className="border-t p-4">
      <div className="h-4 w-full rounded-md bg-muted/70 animate-pulse" />
    </div>
  </div>
);

export default function DashboardPage() {
  const { data, isLoading, error, isManager } = useDashboardData();
  const { user } = useAuth();

  useEffect(() => {
    // This could be used for analytics or other side effects when dashboard loads
    console.log("Dashboard loaded with isManager:", isManager);
  }, [isManager]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-1/4 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-1/2 rounded-md bg-muted/80 animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </div>
        <div className="space-y-4">
          <div className="h-10 w-1/3 rounded-md bg-muted/80 animate-pulse" />
          <div className="grid gap-6 md:grid-cols-3">
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertTriangle className="h-16 w-16 text-amber-500" />
        <h2 className="text-2xl font-bold">Error al cargar los datos</h2>
        <p className="text-muted-foreground text-center max-w-md">{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  // No data state or role not determined yet
  if (!data || isManager === null) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertTriangle className="h-16 w-16 text-amber-500" />
        <h2 className="text-2xl font-bold">Cargando información del usuario</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Estamos determinando tu rol en el sistema. Si este mensaje persiste, por favor contacta al soporte.
        </p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  return isManager === true ? (
    <ManagerDashboard userName={user?.nombre || "Usuario"} />
  ) : isManager === false ? (
    <EmployeeDashboard userName={user?.nombre || "Usuario"} />
  ) : (
    // This should not happen if our earlier checks are working, but just in case
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <AlertTriangle className="h-16 w-16 text-amber-500" />
      <h2 className="text-2xl font-bold">Error al determinar rol</h2>
      <p className="text-muted-foreground text-center max-w-md">
        No pudimos determinar tu rol en el sistema. Por favor, contacta al soporte.
      </p>
      <Button onClick={() => window.location.reload()}>Reintentar</Button>
    </div>
  );
}