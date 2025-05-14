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
import { MetaProfesional } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

function ProfessionalGoalsGraph({
  professionalGoals,
}: {
  professionalGoals: MetaProfesional[] | undefined;
}) {
  const [filter, setFilter] = useState<"ESTADO" | "PLAZO" | "PRIORIDAD">(
    "ESTADO"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!professionalGoals || professionalGoals.length === 0) {
      return [];
    }

    switch (filter) {
      case "ESTADO":
        const estadoCounts = {
          COMPLETADA: 0,
          EN_PROGRESO: 0,
          PENDIENTE: 0,
          CANCELADA: 0,
        };

        professionalGoals.forEach((goal) => {
          if (goal.estado in estadoCounts) {
            estadoCounts[goal.estado as keyof typeof estadoCounts]++;
          }
        });

        return [
          {
            label: "COMPLETADA",
            value: estadoCounts.COMPLETADA,
            color: "rgba(75, 192, 192, 0.8)",
          },
          {
            label: "EN_PROGRESO",
            value: estadoCounts.EN_PROGRESO,
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "PENDIENTE",
            value: estadoCounts.PENDIENTE,
            color: "rgba(255, 206, 86, 0.8)",
          },
          {
            label: "CANCELADA",
            value: estadoCounts.CANCELADA,
            color: "rgba(255, 99, 132, 0.8)",
          },
        ];

      case "PLAZO":
        const plazoCounts = {
          CORTO: 0,
          MEDIANO: 0,
          LARGO: 0,
        };

        professionalGoals.forEach((goal) => {
          if (goal.plazo in plazoCounts) {
            plazoCounts[goal.plazo as keyof typeof plazoCounts]++;
          }
        });

        return [
          {
            label: "CORTO",
            value: plazoCounts.CORTO,
            color: "rgba(255, 99, 132, 0.8)",
          },
          {
            label: "MEDIANO",
            value: plazoCounts.MEDIANO,
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "LARGO",
            value: plazoCounts.LARGO,
            color: "rgba(75, 192, 192, 0.8)",
          },
        ];

      case "PRIORIDAD":
        const prioridadCounts: { [key: number]: number } = {};

        professionalGoals.forEach((goal) => {
          prioridadCounts[goal.prioridad] =
            (prioridadCounts[goal.prioridad] || 0) + 1;
        });

        const prioridadColors = [
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ];

        return Object.entries(prioridadCounts).map(([prioridad, count]) => ({
          label: `Prioridad ${prioridad}`,
          value: count,
          color:
            prioridadColors[parseInt(prioridad) - 1] ||
            "rgba(153, 102, 255, 0.8)",
        }));

      default:
        return [];
    }
  };

  const data = processData();

  const getChartTitle = () => {
    switch (filter) {
      case "ESTADO":
        return "Metas Profesionales por Estado";
      case "PLAZO":
        return "Metas Profesionales por Plazo";
      case "PRIORIDAD":
        return "Metas Profesionales por Prioridad";
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
                        ? (dataset.backgroundColor[i] as string)
                        : typeof dataset.backgroundColor === "string"
                        ? dataset.backgroundColor
                        : "#000",
                      strokeStyle: Array.isArray(dataset.borderColor)
                        ? (dataset.borderColor[i] as string)
                        : typeof dataset.borderColor === "string"
                        ? dataset.borderColor
                        : "#000",
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
          Análisis de Metas Profesionales
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
            <DropdownMenuItem onSelect={() => setFilter("ESTADO")}>
              ESTADO
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("PLAZO")}>
              PLAZO
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("PRIORIDAD")}>
              PRIORIDAD
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

export default ProfessionalGoalsGraph;
