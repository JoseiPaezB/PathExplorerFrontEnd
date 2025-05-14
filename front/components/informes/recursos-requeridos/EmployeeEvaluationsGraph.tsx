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
import { EvaluacionEmpleado } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

function EmployeeEvaluationsGraph({
  employeeEvaluations,
}: {
  employeeEvaluations: EvaluacionEmpleado[] | undefined;
}) {
  const [filter, setFilter] = useState<"CALIFICACION" | "PERIODO">(
    "CALIFICACION"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!employeeEvaluations || employeeEvaluations.length === 0) {
      return [];
    }

    switch (filter) {
      case "CALIFICACION": {
        const calificacionCounts = {
          "Excelente (9-10)": 0,
          "Muy Bueno (7-8)": 0,
          "Bueno (5-6)": 0,
          "Regular (3-4)": 0,
          "Necesita Mejora (1-2)": 0,
        };

        employeeEvaluations.forEach((evaluation) => {
          const cal = evaluation.calificacion;
          if (cal >= 9) {
            calificacionCounts["Excelente (9-10)"]++;
          } else if (cal >= 7) {
            calificacionCounts["Muy Bueno (7-8)"]++;
          } else if (cal >= 5) {
            calificacionCounts["Bueno (5-6)"]++;
          } else if (cal >= 3) {
            calificacionCounts["Regular (3-4)"]++;
          } else {
            calificacionCounts["Necesita Mejora (1-2)"]++;
          }
        });

        return [
          {
            label: "Excelente (9-10)",
            value: calificacionCounts["Excelente (9-10)"],
            color: "rgba(75, 192, 192, 0.8)",
          },
          {
            label: "Muy Bueno (7-8)",
            value: calificacionCounts["Muy Bueno (7-8)"],
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "Bueno (5-6)",
            value: calificacionCounts["Bueno (5-6)"],
            color: "rgba(255, 206, 86, 0.8)",
          },
          {
            label: "Regular (3-4)",
            value: calificacionCounts["Regular (3-4)"],
            color: "rgba(255, 159, 64, 0.8)",
          },
          {
            label: "Necesita Mejora (1-2)",
            value: calificacionCounts["Necesita Mejora (1-2)"],
            color: "rgba(255, 99, 132, 0.8)",
          },
        ];
      }

      case "PERIODO": {
        const periodoCounts: { [key: string]: number } = {};
        const now = new Date();

        employeeEvaluations.forEach((evaluation) => {
          const evalDate = new Date(evaluation.fecha);
          const monthsDiff =
            (now.getTime() - evalDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

          let periodo = "Otros";
          if (monthsDiff <= 3) {
            periodo = "Últimos 3 meses";
          } else if (monthsDiff <= 6) {
            periodo = "3-6 meses";
          } else if (monthsDiff <= 12) {
            periodo = "6-12 meses";
          } else {
            periodo = "Más de 1 año";
          }

          periodoCounts[periodo] = (periodoCounts[periodo] || 0) + 1;
        });

        const colors = [
          "rgba(75, 192, 192, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(255, 99, 132, 0.8)",
        ];

        const orderedPeriods = [
          "Últimos 3 meses",
          "3-6 meses",
          "6-12 meses",
          "Más de 1 año",
          "Otros",
        ];

        return orderedPeriods
          .filter((periodo) => periodoCounts[periodo] > 0)
          .map((periodo, index) => ({
            label: periodo,
            value: periodoCounts[periodo],
            color: colors[index % colors.length],
          }));
      }

      default:
        return [];
    }
  };

  const data = processData();

  const getChartTitle = () => {
    switch (filter) {
      case "CALIFICACION":
        return "Evaluaciones por Rango de Calificación";
      case "PERIODO":
        return "Evaluaciones por Período";
      default:
        return "Evaluaciones de Empleados";
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
        <h3 className="text-lg font-semibold">Análisis de Evaluaciones</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>
                {filter === "CALIFICACION"
                  ? "CALIFICACIÓN"
                  : filter === "PERIODO"
                  ? "PERÍODO"
                  : ""}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setFilter("CALIFICACION")}>
              CALIFICACIÓN
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("PERIODO")}>
              PERÍODO
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

export default EmployeeEvaluationsGraph;
