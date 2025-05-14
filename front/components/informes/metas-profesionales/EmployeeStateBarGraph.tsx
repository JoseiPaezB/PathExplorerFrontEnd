import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ChartConfiguration } from "chart.js";
import { EstadoEmpleado } from "@/types/informes";

function EmployeeStateBarGraph({
  employeesStates,
}: {
  employeesStates: EstadoEmpleado[] | undefined;
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !employeesStates || employeesStates.length === 0)
      return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const processedData = employeesStates
      .sort(
        (a, b) =>
          parseFloat(b.porcentaje_disponibilidad) -
          parseFloat(a.porcentaje_disponibilidad)
      )
      .slice(0, 15);
    const getBarColor = (state: string) => {
      if (state === "ASIGNADO") return "rgba(54, 162, 235, 0.8)";
      if (state === "BANCA") return "rgba(255, 206, 86, 0.8)";
      return "rgba(255, 99, 132, 0.8)";
    };

    const employeesByState = {
      ASIGNADO: employeesStates.filter((emp) => emp.estado === "ASIGNADO")
        .length,
      BANCA: employeesStates.filter((emp) => emp.estado === "BANCA").length,
    };

    const data = {
      labels: ["Asignados", "En Banca"],
      datasets: [
        {
          label: "Número de Empleados",
          data: [employeesByState.ASIGNADO, employeesByState.BANCA],
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
          ],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Disponibilidad de Empleados",
            font: {
              size: 18,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            beginAtZero: true,
            max: employeesStates.length,
            ticks: {
              stepSize: 5,
              callback: function (value) {
                return value;
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
  }, [employeesStates]);

  return (
    <div className="w-full h-96 p-4">
      <canvas ref={chartRef} />
    </div>
  );
}

export default EmployeeStateBarGraph;
