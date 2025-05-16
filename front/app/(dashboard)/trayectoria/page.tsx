"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchTrayectory } from "@/hooks/fetchTrayectory";
import { fetchGetTrayectoriesByRole } from "@/hooks/fetchGetTrayectoriesByRole";
import { useAddTrayectory } from "@/hooks/useAddTrayectory";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

function Page() {
  const {
    trayectory,
    isLoading: isLoadingTrayectory,
    error: trayectoryError,
  } = fetchTrayectory();

  const {
    trayectories,
    isLoading: isLoadingRecommendations,
    error: recommendationsError,
    fetchTrayectoriesByRole,
  } = fetchGetTrayectoriesByRole();

  const { addTrayectory, isSubmitting: isAddingTrayectory } =
    useAddTrayectory();

  const [selectedTrayectoryId, setSelectedTrayectoryId] = useState<
    number | undefined
  >(undefined);
  const [showRecommendations, setShowRecommendations] =
    useState<boolean>(false);

  const hasUserTrayectory = trayectory?.trayectoria !== undefined;
  const userTrayectory = trayectory?.trayectoria;

  const showLoadingSpinner = isLoadingTrayectory || isAddingTrayectory;

  useEffect(() => {
    if (!isLoadingTrayectory && !hasUserTrayectory && !showRecommendations) {
      fetchTrayectoriesByRole();
      setShowRecommendations(true);
    }
  }, [
    isLoadingTrayectory,
    hasUserTrayectory,
    fetchTrayectoriesByRole,
    showRecommendations,
  ]);

  const handleTrayectorySelection = (id: string) => {
    const parsedId = parseInt(id, 10);
    setSelectedTrayectoryId(parsedId);
  };

  const handleSubmit = async () => {
    if (selectedTrayectoryId !== undefined) {
      if (trayectories && trayectories[selectedTrayectoryId]) {
        const selectedTrayectory = trayectories[selectedTrayectoryId];

        await addTrayectory({
          nombre: selectedTrayectory.nombre,
          descripcion: selectedTrayectory.descripcion,
          tiempo_estimado: selectedTrayectory.tiempo_estimado,
          roles_secuenciales: Array.isArray(
            selectedTrayectory.roles_secuenciales
          )
            ? selectedTrayectory.roles_secuenciales
            : [selectedTrayectory.roles_secuenciales],
        })
          .then(() => {
            setShowRecommendations(false);
            setSelectedTrayectoryId(undefined);
          })
          .catch((error) => {
            console.error("Error al registrar trayectoria:", error);
          });

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
        {showLoadingSpinner ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner
              size="md"
              color="primary"
              text="Cargando trayectorias..."
            />
          </div>
        ) : hasUserTrayectory && userTrayectory ? (
          <div>
            <h3 className="text-lg font-medium">{userTrayectory.nombre}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {userTrayectory.descripcion}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm font-medium">Roles secuenciales:</p>
                <p className="text-sm">{userTrayectory.roles_secuenciales}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tiempo estimado:</p>
                <p className="text-sm">
                  {userTrayectory.tiempo_estimado} meses
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Progreso:</p>
                <p className="text-sm">
                  {parseFloat(userTrayectory.progreso).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Etapa actual:</p>
                <p className="text-sm">{userTrayectory.etapa_actual}</p>
              </div>
            </div>
          </div>
        ) : showRecommendations ? (
          isLoadingRecommendations ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner
                size="md"
                color="primary"
                text="Cargando recomendaciones..."
              />
            </div>
          ) : trayectories && trayectories.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-4">
                Trayectorias recomendadas
              </h3>
              <RadioGroup
                value={
                  selectedTrayectoryId !== undefined
                    ? selectedTrayectoryId.toString()
                    : ""
                }
                onValueChange={handleTrayectorySelection}
                className="space-y-4"
              >
                {trayectories.map((tray, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 border p-4 rounded-md"
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`trayectory-${index}`}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5">
                      <Label
                        htmlFor={`trayectory-${index}`}
                        className="font-medium"
                      >
                        {tray.nombre}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {tray.descripcion}
                      </p>
                      <p className="text-xs text-gray-500">
                        Duración estimada: {tray.tiempo_estimado} meses
                      </p>
                      <p className="text-xs text-gray-500">
                        Roles:{" "}
                        {Array.isArray(tray.roles_secuenciales)
                          ? tray.roles_secuenciales.join("->")
                          : tray.roles_secuenciales}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <Button
                onClick={handleSubmit}
                disabled={selectedTrayectoryId === null || isAddingTrayectory}
                className="mt-4 w-full"
              >
                {isAddingTrayectory
                  ? "Registrando..."
                  : "Registrar trayectoria"}
              </Button>
            </div>
          ) : (
            <div>
              <p>No se encontraron trayectorias para mostrar.</p>
              <Button onClick={fetchTrayectoriesByRole} className="mt-4">
                Intentar obtener recomendaciones
              </Button>
            </div>
          )
        ) : trayectoryError || recommendationsError ? (
          <div className="text-red-500">
            {trayectoryError && (
              <p>Error al cargar trayectoria: {trayectoryError}</p>
            )}
            {recommendationsError && (
              <p>Error al cargar recomendaciones: {recommendationsError}</p>
            )}
          </div>
        ) : (
          <div>
            <p>No se encontraron trayectorias para mostrar.</p>
            <Button onClick={fetchTrayectoriesByRole} className="mt-4">
              Intentar obtener recomendaciones
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Page;
