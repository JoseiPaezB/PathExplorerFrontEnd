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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

function Page() {
  const { trayectory, isLoading: isLoadingTrayectory, error: trayectoryError } = fetchTrayectory();
  const { trayectories, isLoading: isLoadingRecommendations, error: recommendationsError, fetchTrayectoriesByRole } = fetchGetTrayectoriesByRole();
  const { addTrayectory, isLoading: isAddingTrayectory } = useAddTrayectory();
  
  const [selectedTrayectoryId, setSelectedTrayectoryId] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const hasUserTrayectory = trayectory?.trayectoria !== undefined;
  const userTrayectory = trayectory?.trayectoria;
  
  const isLoading = isLoadingTrayectory || isLoadingRecommendations || isAddingTrayectory;
  
  useEffect(() => {
    if (!isLoadingTrayectory && !hasUserTrayectory) {
      setShowRecommendations(true);
    } else {
      setShowRecommendations(false);
    }
  }, [isLoadingTrayectory, hasUserTrayectory]);
  
  const handleTrayectorySelection = (id) => {
    setSelectedTrayectoryId(id);
  };
  
 const handleSubmit = async () => {
  if (selectedTrayectoryId !== null) {
    const selectedIndex = parseInt(selectedTrayectoryId);
    if (trayectories && trayectories[selectedIndex]) {
      const selectedTrayectory = trayectories[selectedIndex];
      
      console.log("Trayectoria seleccionada:", selectedTrayectory);
      
      
      await addTrayectory(selectedTrayectory);
      
      
      window.location.reload();
    }
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trayectoria</CardTitle>
        <CardDescription>
          {hasUserTrayectory
            ? "Ya tienes una trayectoria registrada"
            : "Selecciona una trayectoria para tu desarrollo profesional"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Cargando...</p>
        ) : hasUserTrayectory && userTrayectory ? (
          <div>
            <h3 className="text-lg font-medium">{userTrayectory.nombre}</h3>
            <p className="text-sm text-gray-500 mt-1">{userTrayectory.descripcion}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm font-medium">Roles secuenciales:</p>
                <p className="text-sm">{userTrayectory.roles_secuenciales}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tiempo estimado:</p>
                <p className="text-sm">{userTrayectory.tiempo_estimado} meses</p>
              </div>
              <div>
                <p className="text-sm font-medium">Progreso:</p>
                <p className="text-sm">{parseFloat(userTrayectory.progreso).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Etapa actual:</p>
                <p className="text-sm">{userTrayectory.etapa_actual}</p>
              </div>
            </div>
          </div>
        ) : showRecommendations && trayectories && trayectories.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium mb-4">Trayectorias recomendadas</h3>
            <RadioGroup
              value={selectedTrayectoryId}
              onValueChange={handleTrayectorySelection}
              className="space-y-4"
            >
              {trayectories.map((tray, index) => (
                <div key={index} className="flex items-start space-x-2 border p-4 rounded-md">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`trayectory-${index}`}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor={`trayectory-${index}`} className="font-medium">
                      {tray.nombre}
                    </Label>
                    <p className="text-sm text-gray-500">{tray.descripcion}</p>
                    <p className="text-xs text-gray-500">Duración estimada: {tray.tiempo_estimado} meses</p>
                    <p className="text-xs text-gray-500">Roles: {tray.roles_secuenciales}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={handleSubmit} 
              disabled={selectedTrayectoryId === undefined || isAddingTrayectory}
              className="mt-4 w-full"
            >
              {isAddingTrayectory ? "Registrando..." : "Registrar trayectoria"}
            </Button>
          </div>
        ) : (trayectoryError || recommendationsError) ? (
          <div className="text-red-500">
            {trayectoryError && <p>Error al cargar trayectoria: {trayectoryError}</p>}
            {recommendationsError && <p>Error al cargar recomendaciones: {recommendationsError}</p>}
          </div>
        ) : (
          <div>
            <p>No se encontraron trayectorias para mostrar.</p>
            <Button 
              onClick={() => fetchTrayectoriesByRole()}
              className="mt-4"
            >
              Intentar obtener recomendaciones
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Page;