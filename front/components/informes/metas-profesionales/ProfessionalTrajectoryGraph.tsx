import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { ChartConfiguration } from "chart.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { TrayectoriaProfesional } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

function ProfessionalTrajectoryGraph({
  professionalTrajectory,
}: {
  professionalTrajectory: TrayectoriaProfesional[] | undefined;
}) {
  const [filter, setFilter] = useState<"ETAPA" | "PROGRESO" | "POR NOMBRE">(
    "ETAPA"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!professionalTrajectory || professionalTrajectory.length === 0) {
      return [];
    }

    switch (filter) {
      case "ETAPA":
        const etapaCounts = {
          "FASE INICIAL": 0,
          "FASE INTERMEDIA": 0,
          "FASE AVANZADA": 0,
        };

        professionalTrajectory.forEach((trajectory) => {
          const etapa = trajectory.etapa_actual.toUpperCase();
          if (etapa in etapaCounts) {
            etapaCounts[etapa as keyof typeof etapaCounts]++;
          }
        });

        return [
          {
            label: "FASE_INICIAL",
            value: etapaCounts["FASE INICIAL"],
            color: "rgba(75, 192, 192, 0.8)",
          },
          {
            label: "FASE_INTERMEDIA",
            value: etapaCounts["FASE INTERMEDIA"],
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "FASE_AVANZADA",
            value: etapaCounts["FASE AVANZADA"],
            color: "rgba(255, 206, 86, 0.8)",
          },
        ];

      case "PROGRESO":
        const progresoCounts = {
          "0-25%": 0,
          "26-50%": 0,
          "51-75%": 0,
          "76-100%": 0,
        };
        professionalTrajectory.forEach((trajectory) => {
          const progreso = parseFloat(trajectory.progreso);
          if (progreso >= 0 && progreso <= 25) {
            progresoCounts["0-25%"]++;
          } else if (progreso > 25 && progreso <= 50) {
            progresoCounts["26-50%"]++;
          } else if (progreso > 50 && progreso <= 75) {
            progresoCounts["51-75%"]++;
          } else if (progreso > 75 && progreso <= 100) {
            progresoCounts["76-100%"]++;
          }
        });

        return [
          {
            label: "0-25%",
            value: progresoCounts["0-25%"],
            color: "rgba(255, 99, 132, 0.8)",
          },
          {
            label: "26-50%",
            value: progresoCounts["26-50%"],
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "51-75%",
            value: progresoCounts["51-75%"],
            color: "rgba(75, 192, 192, 0.8)",
          },
          {
            label: "76-100%",
            value: progresoCounts["76-100%"],
            color: "rgba(255, 206, 86, 0.8)",
          },
        ];

      case "POR NOMBRE":
        const nombreCounts: { [key: string]: number } = {};
        professionalTrajectory.forEach((trajectory) => {
          const nombre = trajectory.nombre;
          if (nombre in nombreCounts) {
            nombreCounts[nombre]++;
          } else {
            nombreCounts[nombre] = 1;
          }
        });

        const nombreColors = [
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ];

        const nombres = Object.keys(nombreCounts).slice(0, 5);
        return nombres.map((nombre, index) => ({
          label: nombre,
          value: nombreCounts[nombre],
          color: nombreColors[index % nombreColors.length],
        }));

      default:
        return [];
    }
  };

  const data = processData();

  const getChartTitle = () => {
    switch (filter) {
      case "ETAPA":
        return "Metas Profesionales por Etapa";
      case "PROGRESO":
        return "Metas Profesionales por Progreso";
      case "POR NOMBRE":
        return "Metas Profesionales por Nombre de trayectoria";
      default:
        return "Metas Profesionales";
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels: data.map((item) => item.label),
        datasets: [
          {
            data: data.map((item) => item.value),
            backgroundColor: data.map((item) => item.color),
            borderColor: data.map((item) => item.color.replace("0.8", "1")),
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels && data.datasets.length) {
                  const dataset = data.datasets[0];
                  const total = dataset.data.reduce(
                    (sum: number, value: any) => sum + value,
                    0
                  );

                  return data.labels.map((label, i) => {
                    const value = dataset.data[i] as number;
                    const percentage =
                      total > 0 ? ((value / total) * 100).toFixed(1) : "0";

                    return {
                      text: `${label}: ${value} (${percentage}%)`,
                      fillStyle: Array.isArray(dataset.backgroundColor)
                        ? dataset.backgroundColor[i]
                        : (dataset.backgroundColor as string),
                      strokeStyle: Array.isArray(dataset.borderColor)
                        ? dataset.borderColor[i]
                        : (dataset.borderColor as string),
                      lineWidth: dataset.borderWidth as number,
                      hidden: false,
                      index: i,
                    };
                  });
                }
                return [];
              },
              padding: 20,
              font: {
                size: 14,
              },
            },
          },
          title: {
            display: true,
            text: getChartTitle(),
            font: {
              size: 18,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 30,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.parsed || 0;
                const dataset = context.dataset;
                const total = dataset.data.reduce(
                  (sum: number, val: any) => sum + val,
                  0
                );
                const percentage =
                  total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, filter]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Análisis de Trayectorias Profesionales
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>{filter}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setFilter("ETAPA")}>
              ETAPA
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("PROGRESO")}>
              PROGRESO
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("POR NOMBRE")}>
              POR NOMBRE
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="h-96">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}

export default ProfessionalTrajectoryGraph;
