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
import { CertificacionEmpleado } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

function EmployeeCertificationsGraph({
  employeeCertifications,
}: {
  employeeCertifications: CertificacionEmpleado[] | undefined;
}) {
  const [filter, setFilter] = useState<"TIPO" | "VENCIMIENTO" | "VALIDACION">(
    "TIPO"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!employeeCertifications || employeeCertifications.length === 0) {
      return [];
    }

    switch (filter) {
      case "TIPO": {
        const tipoCounts: { [key: string]: number } = {};

        employeeCertifications.forEach((cert) => {
          let provider = "Otros";
          if (cert.nombre.includes("AWS")) provider = "AWS";
          else if (
            cert.nombre.includes("Microsoft") ||
            cert.nombre.includes("Azure")
          )
            provider = "Microsoft";
          else if (
            cert.nombre.includes("Oracle") ||
            cert.nombre.includes("Java")
          )
            provider = "Oracle";
          else if (cert.nombre.includes("Google Cloud")) provider = "Google";
          else if (
            cert.nombre.includes("Scrum") ||
            cert.nombre.includes("PSM") ||
            cert.nombre.includes("CSM")
          )
            provider = "Scrum";
          else if (cert.nombre.includes("Kubernetes")) provider = "Kubernetes";
          else if (
            cert.nombre.includes("Security") ||
            cert.nombre.includes("CISSP") ||
            cert.nombre.includes("Ethical Hacker") ||
            cert.nombre.includes("CCSP")
          )
            provider = "Security";
          else if (cert.nombre.includes("TensorFlow")) provider = "TensorFlow";
          else if (cert.nombre.includes("Tableau")) provider = "Tableau";
          else if (cert.nombre.includes("Power BI")) provider = "Power BI";

          tipoCounts[provider] = (tipoCounts[provider] || 0) + 1;
        });

        const colors = [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(255, 99, 71, 0.8)",
          "rgba(64, 224, 208, 0.8)",
          "rgba(255, 215, 0, 0.8)",
          "rgba(147, 112, 219, 0.8)",
        ];

        return Object.entries(tipoCounts).map(([tipo, count], index) => ({
          label: tipo,
          value: count,
          color: colors[index % colors.length],
        }));
      }

      case "VENCIMIENTO": {
        const vencimientoCounts = {
          "Sin vencimiento": 0,
          Vencido: 0,
          "Vigente < 1 año": 0,
          "Vigente 1-2 años": 0,
          "Vigente > 2 años": 0,
        };

        const now = new Date();

        employeeCertifications.forEach((cert) => {
          if (!cert.fecha_vencimiento) {
            vencimientoCounts["Sin vencimiento"]++;
          } else {
            const expDate = new Date(cert.fecha_vencimiento);
            const monthsUntilExpiration =
              (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

            if (monthsUntilExpiration < 0) {
              vencimientoCounts["Vencido"]++;
            } else if (monthsUntilExpiration < 12) {
              vencimientoCounts["Vigente < 1 año"]++;
            } else if (monthsUntilExpiration < 24) {
              vencimientoCounts["Vigente 1-2 años"]++;
            } else {
              vencimientoCounts["Vigente > 2 años"]++;
            }
          }
        });

        return [
          {
            label: "Sin vencimiento",
            value: vencimientoCounts["Sin vencimiento"],
            color: "rgba(75, 192, 192, 0.8)",
          },
          {
            label: "Vencido",
            value: vencimientoCounts["Vencido"],
            color: "rgba(255, 99, 132, 0.8)",
          },
          {
            label: "Vigente < 1 año",
            value: vencimientoCounts["Vigente < 1 año"],
            color: "rgba(255, 206, 86, 0.8)",
          },
          {
            label: "Vigente 1-2 años",
            value: vencimientoCounts["Vigente 1-2 años"],
            color: "rgba(54, 162, 235, 0.8)",
          },
          {
            label: "Vigente > 2 años",
            value: vencimientoCounts["Vigente > 2 años"],
            color: "rgba(153, 102, 255, 0.8)",
          },
        ];
      }

      case "VALIDACION": {
        const validacionCounts = {
          Validado: 0,
          "No validado": 0,
        };

        employeeCertifications.forEach((cert) => {
          if (cert.estado_validacion) {
            validacionCounts["Validado"]++;
          } else {
            validacionCounts["No validado"]++;
          }
        });

        return [
          {
            label: "Validado",
            value: validacionCounts["Validado"],
            color: "rgba(75, 192, 192, 0.8)",
          },
          {
            label: "No validado",
            value: validacionCounts["No validado"],
            color: "rgba(255, 99, 132, 0.8)",
          },
        ];
      }

      default:
        return [];
    }
  };

  const data = processData();

  const getChartTitle = () => {
    switch (filter) {
      case "TIPO":
        return "Certificaciones por Proveedor";
      case "VENCIMIENTO":
        return "Certificaciones por Estado de Vigencia";
      case "VALIDACION":
        return "Certificaciones por Estado de Validación";
      default:
        return "Certificaciones de Empleados";
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
        <h3 className="text-lg font-semibold">Análisis de Certificaciones</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>
                {filter === "TIPO"
                  ? "PROVEEDOR"
                  : filter === "VENCIMIENTO"
                  ? "VIGENCIA"
                  : filter}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setFilter("TIPO")}>
              PROVEEDOR
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("VENCIMIENTO")}>
              VIGENCIA
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("VALIDACION")}>
              VALIDACIÓN
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

export default EmployeeCertificationsGraph;
