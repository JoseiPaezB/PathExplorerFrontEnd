"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import html2canvas from "html2canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProfessionalGoalsGraph from "@/components/informes/metas-profesionales/ProfessionalGoalsGraph";
import ProfessionalTrajectoryGraph from "@/components/informes/metas-profesionales/ProfessionalTrajectoryGraph";
import EmployeeStateBarGraph from "@/components/informes/metas-profesionales/EmployeeStateBarGraph";
import MostRequiredSkillsForRoleGraph from "@/components/informes/recursos-requeridos/MostRequiredSkillsForRoleGraph";
import EmployeeCertificationsGraph from "@/components/informes/empleados-desarrollo/EmployeeCertificationsGraph";
import EmployeeCoursesGraph from "@/components/informes/empleados-desarrollo/EmployeeCoursesGraph";
import EmployeeEvaluationsGraph from "@/components/informes/recursos-requeridos/EmployeeEvaluationsGraph";
import ExportDataModal from "@/components/informes/exportar/ExportDataModal";
import { fetchGetAllInformes } from "@/hooks/fetchGetAllInformes";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

function page() {
  const { informes, isLoading, error } = fetchGetAllInformes();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("desarrollo");

  const handleExport = async (
    title: string = "informes",
    selectedFormat: string = "excel",
    selectedCharts: string[] = [],
    selectedDataSets: string[] = []
  ) => {
    if (
      title === "" ||
      title === undefined ||
      selectedFormat === "" ||
      selectedFormat === undefined ||
      (selectedCharts.length === 0 && selectedDataSets.length === 0)
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    if (selectedFormat === "excel") {
      const workbook = XLSX.utils.book_new();
      let sheetsAdded = false;

      if (informes && informes.informes) {
        for (const datasetName of selectedDataSets) {
          if (datasetName in informes.informes) {
            const datasetArray =
              informes.informes[datasetName as keyof typeof informes.informes];
            if (Array.isArray(datasetArray) && datasetArray.length > 0) {
              const worksheet = XLSX.utils.json_to_sheet(datasetArray);
              const sheetName =
                datasetName.length > 31
                  ? datasetName.substring(0, 31)
                  : datasetName;
              XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
              sheetsAdded = true;
            }
          }
        }
      }

      if (!sheetsAdded) {
        alert(
          "No se encontraron datos para exportar. Por favor, seleccione datasets válidos."
        );
        return;
      }

      XLSX.writeFile(workbook, `${title}.xlsx`);
    } else if (selectedFormat === "csv") {
      if (informes && informes.informes) {
        for (const datasetName of selectedDataSets) {
          if (datasetName in informes.informes) {
            const datasetArray =
              informes.informes[datasetName as keyof typeof informes.informes];
            if (Array.isArray(datasetArray) && datasetArray.length > 0) {
              const csvContent = datasetArray
                .map((row: any) => Object.values(row).join(","))
                .join("\n");
              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.setAttribute("href", url);
              a.setAttribute("download", `${title}.csv`);
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          }
        }
      }
    } else if (selectedFormat === "pdf") {
      const doc = new jsPDF();
      let yPosition = 20;

      doc.setFontSize(16);
      doc.text(title, 14, yPosition);
      yPosition += 20;

      if (informes && informes.informes && selectedDataSets.length > 0) {
        for (const datasetName of selectedDataSets) {
          if (datasetName in informes.informes) {
            const datasetArray =
              informes.informes[datasetName as keyof typeof informes.informes];

            if (Array.isArray(datasetArray) && datasetArray.length > 0) {
              doc.setFontSize(12);
              doc.text(datasetName, 14, yPosition);
              yPosition += 10;

              const headers = Object.keys(datasetArray[0]);
              const rows = datasetArray.map((item) =>
                headers.map((header) =>
                  String(item[header as keyof typeof item])
                )
              );

              autoTable(doc, {
                head: [headers],
                body: rows,
                startY: yPosition,
                theme: "striped",
                styles: { fontSize: 8 },
                headStyles: { fillColor: [66, 139, 202] },
              });

              yPosition = doc.lastAutoTable.finalY + 15;

              if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
              }
            }
          }
        }
      }

      if (selectedCharts.length > 0) {
        for (const chartId of selectedCharts) {
          const chartElement = document.getElementById(chartId);

          if (chartElement) {
            const canvas = chartElement.querySelector("canvas") || chartElement;

            if (canvas instanceof HTMLCanvasElement) {
              const imageData = canvas.toDataURL("image/png");

              if (yPosition + 100 > 280) {
                doc.addPage();
                yPosition = 20;
              }

              const chartTitle =
                chartElement.getAttribute("data-title") || chartId;
              doc.setFontSize(12);
              doc.text(chartTitle, 14, yPosition);
              yPosition += 10;

              doc.addImage(imageData, "PNG", 14, yPosition, 180, 90);
              yPosition += 100;
            } else {
              try {
                const canvasImage = await html2canvas(chartElement);
                const imageData = canvasImage.toDataURL("image/png");

                if (yPosition + 100 > 280) {
                  doc.addPage();
                  yPosition = 20;
                }
                const chartTitle =
                  chartElement.getAttribute("data-title") || chartId;
                doc.setFontSize(12);
                doc.text(chartTitle, 14, yPosition);
                yPosition += 10;

                doc.addImage(imageData, "PNG", 14, yPosition, 180, 90);
                yPosition += 100;
              } catch (error) {
                console.error("Error capturing chart:", error);
              }
            }
          }
        }
      }

      doc.save(`${title}.pdf`);
    }
  };

  return (
    <div className="space-y-6">
      <ExportDataModal
        open={open}
        setOpen={setOpen}
        handleExport={handleExport}
      />
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="desarrollo">Desarollo profesional</TabsTrigger>
          <TabsTrigger value="asignacion">Asignaciones</TabsTrigger>
          <TabsTrigger value="empleados">Aprendizaje de empleados</TabsTrigger>
        </TabsList>

        <Button
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          Exportar
        </Button>

        <TabsContent value="desarrollo" className="space-y-4 pt-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProfessionalGoalsGraph
              professionalGoals={informes?.informes.professionalGoals}
            />
            <ProfessionalTrajectoryGraph
              professionalTrajectory={informes?.informes.professionalTrayectory}
            />
            <EmployeeStateBarGraph
              employeesStates={informes?.informes.employeesStates}
            />
          </div>
        </TabsContent>

        <TabsContent value="asignacion" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 ">
            <MostRequiredSkillsForRoleGraph
              requiredAbilitiesForRoles={
                informes?.informes.requiredAbilitiesForRoles
              }
              roles={informes?.informes.roles}
            />
            <EmployeeEvaluationsGraph
              employeeEvaluations={informes?.informes.employeeEvaluations}
            />
          </div>
        </TabsContent>
        <TabsContent value="empleados" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <EmployeeCertificationsGraph
              employeeCertifications={informes?.informes.employeeCertifications}
            />
            <EmployeeCoursesGraph
              employeeCourses={informes?.informes.employeeCourses}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
