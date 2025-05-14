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
import { CursoEmpleado } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

function EmployeeCoursesGraph({
  employeeCourses,
}: {
  employeeCourses: CursoEmpleado[] | undefined;
}) {
  const [filter, setFilter] = useState<"ESTADO" | "CALIFICACION" | "CATEGORIA">(
    "ESTADO"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!employeeCourses || employeeCourses.length === 0) {
      return [];
    }

    switch (filter) {
      case "ESTADO": {
        const estadoCounts = {
          Completado: 0,
          "En progreso": 0,
          "No iniciado": 0,
        };

        employeeCourses.forEach((course) => {
          const progress = parseFloat(course.progreso || "0");
          const hasFinished = course.fecha_finalizacion !== null;

          if (progress === 100 || hasFinished) {
            estadoCounts["Completado"]++;
          } else if (progress > 0) {
            estadoCounts["En progreso"]++;
          } else {
            estadoCounts["No iniciado"]++;
          }
        });

        return [
          {
            label: "Completado",
            value: estadoCounts["Completado"],
            color: "rgba(75, 192, 192, 0.8)",
          },
          {
            label: "En progreso",
            value: estadoCounts["En progreso"],
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "No iniciado",
            value: estadoCounts["No iniciado"],
            color: "rgba(255, 206, 86, 0.8)",
          },
        ];
      }

      case "CALIFICACION": {
        const calificacionCounts = {
          "Excelente (90-100)": 0,
          "Bueno (80-89)": 0,
          "Regular (70-79)": 0,
          "Bajo (< 70)": 0,
          "Sin calificación": 0,
        };

        employeeCourses.forEach((course) => {
          if (!course.calificacion) {
            calificacionCounts["Sin calificación"]++;
          } else {
            const cal = parseFloat(course.calificacion);
            if (cal >= 90) {
              calificacionCounts["Excelente (90-100)"]++;
            } else if (cal >= 80) {
              calificacionCounts["Bueno (80-89)"]++;
            } else if (cal >= 70) {
              calificacionCounts["Regular (70-79)"]++;
            } else {
              calificacionCounts["Bajo (< 70)"]++;
            }
          }
        });

        return [
          {
            label: "Excelente (90-100)",
            value: calificacionCounts["Excelente (90-100)"],
            color: "rgba(75, 192, 192, 0.8)",
          },
          {
            label: "Bueno (80-89)",
            value: calificacionCounts["Bueno (80-89)"],
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "Regular (70-79)",
            value: calificacionCounts["Regular (70-79)"],
            color: "rgba(255, 206, 86, 0.8)",
          },
          {
            label: "Bajo (< 70)",
            value: calificacionCounts["Bajo (< 70)"],
            color: "rgba(255, 99, 132, 0.8)",
          },
          {
            label: "Sin calificación",
            value: calificacionCounts["Sin calificación"],
            color: "rgba(153, 102, 255, 0.8)",
          },
        ];
      }

      case "CATEGORIA": {
        const categoriaCounts: { [key: string]: number } = {};

        employeeCourses.forEach((course) => {
          // Categorizar cursos basándose en el nombre
          let categoria = "Otros";

          if (
            course.nombre.includes("Java") ||
            course.nombre.includes("Python") ||
            course.nombre.includes("React") ||
            course.nombre.includes("Angular") ||
            course.nombre.includes("Spring Boot")
          ) {
            categoria = "Desarrollo";
          } else if (
            course.nombre.includes("Cloud") ||
            course.nombre.includes("Azure") ||
            course.nombre.includes("AWS") ||
            course.nombre.includes("Kubernetes") ||
            course.nombre.includes("Docker")
          ) {
            categoria = "Cloud & DevOps";
          } else if (
            course.nombre.includes("Scrum") ||
            course.nombre.includes("Agile") ||
            course.nombre.includes("Management") ||
            course.nombre.includes("Leadership")
          ) {
            categoria = "Gestión & Agilidad";
          } else if (
            course.nombre.includes("Data") ||
            course.nombre.includes("Machine Learning") ||
            course.nombre.includes("Big Data") ||
            course.nombre.includes("SQL") ||
            course.nombre.includes("TensorFlow")
          ) {
            categoria = "Data & ML";
          } else if (
            course.nombre.includes("Security") ||
            course.nombre.includes("Cybersecurity")
          ) {
            categoria = "Seguridad";
          } else if (
            course.nombre.includes("UI/UX") ||
            course.nombre.includes("Design")
          ) {
            categoria = "Diseño";
          }

          categoriaCounts[categoria] = (categoriaCounts[categoria] || 0) + 1;
        });

        const colors = [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(255, 99, 71, 0.8)",
        ];

        return Object.entries(categoriaCounts).map(
          ([categoria, count], index) => ({
            label: categoria,
            value: count,
            color: colors[index % colors.length],
          })
        );
      }

      default:
        return [];
    }
  };

  const data = processData();

  const getChartTitle = () => {
    switch (filter) {
      case "ESTADO":
        return "Cursos por Estado de Completitud";
      case "CALIFICACION":
        return "Cursos por Rango de Calificación";
      case "CATEGORIA":
        return "Cursos por Categoría";
      default:
        return "Cursos de Empleados";
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
        <h3 className="text-lg font-semibold">Análisis de Cursos</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>
                {filter === "ESTADO"
                  ? "ESTADO"
                  : filter === "CALIFICACION"
                  ? "CALIFICACIÓN"
                  : "CATEGORÍA"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setFilter("ESTADO")}>
              ESTADO
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("CALIFICACION")}>
              CALIFICACIÓN
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("CATEGORIA")}>
              CATEGORÍA
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

export default EmployeeCoursesGraph;
