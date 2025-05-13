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
import { HabilidadRequeridaRol, Rol } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

function MostRequiredSkillsForRoleGraph({
  requiredAbilitiesForRoles,
  roles,
}: {
  requiredAbilitiesForRoles: HabilidadRequeridaRol[] | undefined;
  roles: Rol[] | undefined;
}) {
  const [filter, setFilter] = useState<
    "TODOS" | "POR ROL" | "POR NIVEL" | "POR IMPORTANCIA"
  >("TODOS");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!requiredAbilitiesForRoles || requiredAbilitiesForRoles.length === 0) {
      return [];
    }

    switch (filter) {
      case "POR ROL":
        const filteredByRole = requiredAbilitiesForRoles.filter(
          (skill) => skill.titulo === roleFilter
        );
        const skillCounts: { [key: string]: number } = {};
        filteredByRole.forEach((skill) => {
          skillCounts[skill.nombre] = (skillCounts[skill.nombre] || 0) + 1;
        });

        return Object.entries(skillCounts).map(([label, value]) => ({
          label,
          value,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        }));

      case "POR NIVEL":
        const levelCounts = {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
        };

        requiredAbilitiesForRoles.forEach((skill) => {
          levelCounts[
            String(skill.nivel_minimo_requerido) as keyof typeof levelCounts
          ] =
            (levelCounts[
              String(skill.nivel_minimo_requerido) as keyof typeof levelCounts
            ] || 0) + 1;
        });

        return [
          {
            label: "NIVEL 1",
            value: levelCounts["1"],
            color: "rgba(255, 99, 132, 0.8)",
          },
          {
            label: "NIVEL 2",
            value: levelCounts["2"],
            color: "rgba(255, 159, 64, 0.8)",
          },
          {
            label: "NIVEL 3",
            value: levelCounts["3"],
            color: "rgba(255, 206, 86, 0.8)",
          },
          {
            label: "NIVEL 4",
            value: levelCounts["4"],
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "NIVEL 5",
            value: levelCounts["5"],
            color: "rgba(75, 192, 192, 0.8)",
          },
        ];

      case "POR IMPORTANCIA":
        const importanceCounts = {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
        };

        requiredAbilitiesForRoles.forEach((skill) => {
          importanceCounts[
            String(skill.importancia) as keyof typeof importanceCounts
          ] =
            (importanceCounts[
              String(skill.importancia) as keyof typeof importanceCounts
            ] || 0) + 1;
        });

        return [
          {
            label: "NIVEL 1",
            value: importanceCounts["1"],
            color: "rgba(255, 99, 132, 0.8)",
          },
          {
            label: "NIVEL 2",
            value: importanceCounts["2"],
            color: "rgba(255, 159, 64, 0.8)",
          },
          {
            label: "NIVEL 3",
            value: importanceCounts["3"],
            color: "rgba(255, 206, 86, 0.8)",
          },
          {
            label: "NIVEL 4",
            value: importanceCounts["4"],
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "NIVEL 5",
            value: importanceCounts["5"],
            color: "rgba(75, 192, 192, 0.8)",
          },
        ];

      default:
        const allCounts: { [key: string]: number } = {};
        requiredAbilitiesForRoles.forEach((skill) => {
          allCounts[skill.nombre] = (allCounts[skill.nombre] || 0) + 1;
        });
        return Object.entries(allCounts).map(([label, value]) => ({
          label,
          value,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        }));
    }
  };

  const data = processData();

  const getChartTitle = () => {
    switch (filter) {
      case "POR ROL":
        return "Habilidades Requeridas por Rol";
      case "POR NIVEL":
        return "Habilidades Requeridas por Nivel";
      case "POR IMPORTANCIA":
        return "Habilidades Requeridas por Importancia";
      default:
        return "Habilidades Requeridas";
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
            align: "center",
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
              padding: 40,
              boxWidth: 20,
              boxHeight: 12,
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
              bottom: 15, // Reducimos el padding inferior del título
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
          Análisis de habilidades requeridas por rol
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
            <DropdownMenuItem onSelect={() => setFilter("POR ROL")}>
              POR ROL
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("POR NIVEL")}>
              POR NIVEL
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("POR IMPORTANCIA")}>
              POR IMPORTANCIA
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("TODOS")}>
              TODOS
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {filter === "POR ROL" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <span>{roleFilter || "Seleccionar Rol"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-48 overflow-y-auto"
            >
              {roles?.map((role: Rol) => (
                <DropdownMenuItem
                  key={role?.id_rol}
                  onSelect={() => setRoleFilter(role?.titulo)}
                >
                  {role.titulo}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="h-96">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}

export default MostRequiredSkillsForRoleGraph;
