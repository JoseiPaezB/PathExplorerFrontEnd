"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
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

declare global {
  interface Window {
    Chart: {
      getChart: (canvas: HTMLCanvasElement) => any;
    };
  }
}

function page() {
  const { informes, isLoading, error } = fetchGetAllInformes();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("desarrollo");
  // Track previous exports to ensure cleanup
  const [previousExport, setPreviousExport] = useState<{
    title?: string;
    format?: string;
    charts?: string[];
    datasets?: string[];
  }>({});

  // Add IDs and data-title attributes to chart elements when they're loaded
  useEffect(() => {
    const setupChartElements = () => {
      // Chart element ID map
      const chartTitles = {
        "professional-goals-graph": "Metas Profesionales",
        "professional-trajectory-graph": "Trayectoria Profesional",
        "employee-state-graph": "Estado de Empleados",
        "required-skills-graph": "Habilidades Requeridas por Rol",
        "employee-certifications-graph": "Certificaciones de Empleados",
        "employee-courses-graph": "Cursos de Empleados",
        "employee-evaluations-graph": "Evaluaciones de Empleados",
      };

      // Set data-title attribute for all charts
      Object.entries(chartTitles).forEach(([id, title]) => {
        const element = document.getElementById(id);
        if (element) {
          element.setAttribute("data-title", title);
        }
      });
    };

    // Wait for charts to be rendered
    if (!isLoading && informes) {
      setTimeout(setupChartElements, 500);
    }
  }, [isLoading, informes, activeTab]);

  // Helper function to capture charts with html2canvas fallback
  // Universal chart capture function that excludes checkboxes and other unwanted elements
  // A simpler, more direct approach to chart capture
  const captureChart = async (chartElement: HTMLElement) => {
    try {
      
      // First try Chart.js if available
      if (typeof window.Chart !== 'undefined') {
        const canvas = chartElement.querySelector('canvas');
        if (canvas) {
          try {
            // Try to get Chart.js instance
            const chartInstance = window.Chart.getChart(canvas);
            if (chartInstance) {
              return {
                imageData: chartInstance.toBase64Image('image/png', 1.0),
                width: canvas.width,
                height: canvas.height
              };
            }
          } catch (e) {
          }
          
          // If no Chart.js instance, try canvas directly
          try {
            return {
              imageData: canvas.toDataURL('image/png', 1.0),
              width: canvas.width,
              height: canvas.height
            };
          } catch (e) {
          }
        }
      }
      
      // If we get here, we need to use html2canvas
      
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      // Temporarily hide checkboxes while capturing
      const elementsToHide: { element: HTMLElement; display: string }[] = [];
      chartElement.querySelectorAll('input, button, select, textarea, .checkbox-container, .legend-checkbox')
        .forEach(el => {
          const element = el as HTMLElement;
          elementsToHide.push({
            element,
            display: element.style.display
          });
          element.style.display = 'none';
        });
      
      try {
        // Use html2canvas directly on the original element
        const canvasOptions = {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: false, // Try setting this to false as it can cause issues
          removeContainer: false // Don't remove the container, which can cause "element not found" errors
        };
        
        // Capture the chart
        const canvas = await html2canvas(chartElement, canvasOptions);
        
        return {
          imageData: canvas.toDataURL('image/png', 1.0),
          width: canvas.width / canvasOptions.scale,
          height: canvas.height / canvasOptions.scale
        };
      } finally {
        // Restore visibility regardless of success or failure
        elementsToHide.forEach(item => {
          item.element.style.display = item.display;
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const prepareChartsForExport = () => {
    // Get all chart containers
    document.querySelectorAll('[id$="-graph"]').forEach(chart => {
      // Call any prepareForExport method the chart component might have exposed
      if (chart && typeof (chart as any).prepareForExport === 'function') {
        (chart as any).prepareForExport();
      }
      
      // Or hide all interactive elements
      chart.querySelectorAll('input, button, select').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    });
  };

  const handleExport = async (
    title: string = "informes",
    selectedFormat: string = "excel",
    selectedCharts: string[] = [], // Este parámetro seguirá existiendo pero será un array vacío
    selectedDataSets: string[] = []
  ) => {
    // Modificamos la validación para que solo verifique datasets, no charts
    if (
      title === "" ||
      title === undefined ||
      selectedFormat === "" ||
      selectedFormat === undefined ||
      selectedDataSets.length === 0 // Solo validamos que haya datasets seleccionados
    ) {
      alert("Por favor, complete todos los campos y seleccione al menos un conjunto de datos.");
      return;
    }

    // Store current export details for cleanup tracking
    setPreviousExport({
      title,
      format: selectedFormat,
      charts: [], // Siempre vacío
      datasets: [...selectedDataSets]
    });

    // Show loading indicator
    const loadingEl = document.createElement('div');
    loadingEl.innerHTML = 'Preparando datos para exportación...';
    loadingEl.style.position = 'fixed';
    loadingEl.style.top = '50%';
    loadingEl.style.left = '50%';
    loadingEl.style.transform = 'translate(-50%, -50%)';
    loadingEl.style.padding = '10px 20px';
    loadingEl.style.background = 'rgba(0,0,0,0.7)';
    loadingEl.style.color = 'white';
    loadingEl.style.borderRadius = '4px';
    loadingEl.style.zIndex = '9999';
    document.body.appendChild(loadingEl);
    
    try {
      // Give charts time to fully render (aunque ya no exportamos gráficos, mantenemos un pequeño delay)
      await new Promise(resolve => setTimeout(resolve, 500));

      // EXCEL EXPORT
      if (selectedFormat === "excel") {
        // Create a fresh workbook each time
        const workbook = XLSX.utils.book_new();
        let sheetsAdded = false;

        // Add metadata to workbook
        workbook.Props = {
          Title: title,
          Subject: "Informes de Empleados",
          Author: "Sistema de Informes",
          CreatedDate: new Date()
        };

        if (informes && informes.informes) {
          for (const datasetName of selectedDataSets) {
            if (datasetName in informes.informes) {
              const datasetArray =
                informes.informes[datasetName as keyof typeof informes.informes];
              if (Array.isArray(datasetArray) && datasetArray.length > 0) {
                // Create a fresh worksheet for each dataset
                const worksheet = XLSX.utils.json_to_sheet([...datasetArray]);
                
                // Set column widths
                const cols = [];
                for (let i = 0; i < Object.keys(datasetArray[0]).length; i++) {
                  cols.push({ wch: 15 }); // Set default column width
                }
                worksheet['!cols'] = cols;
                
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
          const loadingEl = document.querySelector('div[style*="Preparando datos para exportación"]');
          if (loadingEl) {
              document.body.removeChild(loadingEl);
          }
          return;
        }

        // Write to a new file each time
        XLSX.writeFile(workbook, `${title}-${Date.now()}.xlsx`);
      } 
      // CSV EXPORT
      else if (selectedFormat === "csv") {
        if (informes && informes.informes) {
          for (const datasetName of selectedDataSets) {
            if (datasetName in informes.informes) {
              const datasetArray =
                informes.informes[datasetName as keyof typeof informes.informes];
              if (Array.isArray(datasetArray) && datasetArray.length > 0) {
                // Create a fresh copy of the data
                const data = [...datasetArray];
                
                // Create header row
                const headers = Object.keys(data[0]);
                let csvContent = headers.join(",") + "\n";
                
                // Add data rows
                csvContent += data
                  .map((row: any) => 
                    Object.values(row)
                      .map(value => 
                        // Handle values with commas by wrapping in quotes
                        typeof value === 'string' && value.includes(',') 
                          ? `"${value}"` 
                          : String(value)
                      )
                      .join(",")
                  )
                  .join("\n");
                
                // Create a unique filename with timestamp
                const fileName = `${title}-${datasetName}-${Date.now()}.csv`;
                
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.setAttribute("href", url);
                a.setAttribute("download", fileName);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Clean up URL object to prevent memory leaks
                URL.revokeObjectURL(url);
              }
            }
          }
        }
      } 
      // PDF EXPORT
      else if (selectedFormat === "pdf") {
        // Create a fresh PDF document
        const doc = new jsPDF();
        
        // ===== COVER PAGE =====
        // Add cover header with blue background
        doc.setFillColor(41, 128, 185); // Professional blue
        doc.rect(0, 0, doc.internal.pageSize.width, 60, 'F');

        // Title on cover page
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(26);
        doc.setFont('', 'bold');
        doc.text(title.toUpperCase(), 14, 30);

        // Date on cover page
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(12);
        doc.setFont('', 'normal');
        const currentDate = new Date();
        doc.text(`Informe generado el ${currentDate.toLocaleDateString()}`, 14, 80);

        // Table of contents - modificado para mostrar solo datasets, no charts
        if (selectedDataSets.length > 0) {
          doc.setFontSize(14);
          doc.setFont('', 'bold');
          doc.text("Contenido", 14, 100);
          doc.setFont('', 'normal');
          doc.setFontSize(12);
          
          let contentY = 110;
          let contentNum = 1;
          
          // List selected datasets
          for (const dataset of selectedDataSets) {
            doc.text(`${contentNum}. Datos: ${dataset}`, 14, contentY);
            contentY += 8;
            contentNum++;
          }
        }
        
        // ===== CONTENT PAGES =====
        let sectionNum = 1;
        
        // Add datasets
        if (informes && informes.informes && selectedDataSets.length > 0) {
          doc.addPage();
          let yPosition = 20;
          
          for (const datasetName of selectedDataSets) {
            if (datasetName in informes.informes) {
              // Create a fresh copy of the data
              const datasetArray = [...informes.informes[datasetName as keyof typeof informes.informes]];

              if (Array.isArray(datasetArray) && datasetArray.length > 0) {
                // Section header with styling
                doc.setFillColor(245, 245, 245);
                doc.rect(0, yPosition - 10, doc.internal.pageSize.width, 20, 'F');
                
                doc.setFontSize(14);
                doc.setFont('', 'bold');
                doc.setTextColor(40, 40, 40);
                doc.text(`${sectionNum}. ${datasetName}`, 14, yPosition);
                yPosition += 15;
                sectionNum++;

                const headers = Object.keys(datasetArray[0]);
                const rows = datasetArray.map((item) =>
                  headers.map((header) => String(item[header as keyof typeof item]))
                );

                // Table styling - clear styles before adding new ones
                autoTable(doc, {
                  head: [headers],
                  body: rows,
                  startY: yPosition,
                  theme: 'grid',
                  styles: { 
                    fontSize: 9,
                    cellPadding: 3,
                    lineColor: [80, 80, 80],
                    lineWidth: 0.25
                  },
                  headStyles: { 
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center'
                  },
                  bodyStyles: {
                    textColor: 50
                  },
                  alternateRowStyles: {
                    fillColor: [240, 240, 240]
                  },
                  margin: { left: 14, right: 14 }
                });

                yPosition = doc.lastAutoTable.finalY + 25;

                if (yPosition > 250) {
                  doc.addPage();
                  yPosition = 20;
                }
              }
            }
          }
        }
        
        // Add page numbers
        const pageCount = doc.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(9);
          doc.setTextColor(100);
          doc.text(
            `Página ${i} de ${pageCount}`, 
            doc.internal.pageSize.width / 2, 
            doc.internal.pageSize.height - 10, 
            { align: 'center' }
          );
        }

        // Generate unique filename with timestamp
        const pdfFileName = `${title}-${Date.now()}.pdf`;
        doc.save(pdfFileName);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error durante la exportación: ${errorMessage}`);
    } finally {
      // Remove loading indicator
      document.body.removeChild(loadingEl);
      
      // Clear any cached canvas elements
      document.querySelectorAll('canvas').forEach(canvas => {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
      
      // Refresh Chart.js instances if they exist
      if (typeof window.Chart !== 'undefined' && typeof window.Chart.getChart === 'function') {
        document.querySelectorAll('canvas').forEach(canvas => {
          try {
            const chart = window.Chart.getChart(canvas);
            if (chart) {
              chart.update();
            }
          } catch (e) {
            // Ignore errors if chart doesn't exist
          }
        });
      }
    }
    
    alert("Exportación completada con éxito.");
  };

  // ExportDataModal should reset selected values when closed
  const handleCloseModal = () => {
    setOpen(false);
    // Force reset of charts and datasets in the modal if needed
    // This depends on how your ExportDataModal component is implemented
  };

  return (
    <div className="space-y-6">
      <ExportDataModal
        open={open}
        setOpen={handleCloseModal} // Use our custom close handler
        handleExport={handleExport}
      />
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        {/* The rest of the component remains unchanged */}
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

        {/* Rest of the component return statement remains unchanged */}
        <TabsContent value="desarrollo" className="space-y-4 pt-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div id="professional-goals-graph" data-title="Metas Profesionales">
              <ProfessionalGoalsGraph
                professionalGoals={informes?.informes.professionalGoals}
              />
            </div>
            <div id="professional-trajectory-graph" data-title="Trayectoria Profesional">
              <ProfessionalTrajectoryGraph
                professionalTrajectory={informes?.informes.professionalTrayectory}
              />
            </div>
            <div id="employee-state-graph" data-title="Estado de Empleados" className="md:col-span-2">
              <EmployeeStateBarGraph
                employeesStates={informes?.informes.employeesStates}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="asignacion" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 ">
            <div id="required-skills-graph" data-title="Habilidades Requeridas por Rol">
              <MostRequiredSkillsForRoleGraph
                requiredAbilitiesForRoles={
                  informes?.informes.requiredAbilitiesForRoles
                }
                roles={informes?.informes.roles}
              />
            </div>
            <div id="employee-evaluations-graph" data-title="Evaluaciones de Empleados">
              <EmployeeEvaluationsGraph
                employeeEvaluations={informes?.informes.employeeEvaluations}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="empleados" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div id="employee-certifications-graph" data-title="Certificaciones de Empleados">
              <EmployeeCertificationsGraph
                employeeCertifications={informes?.informes.employeeCertifications}
              />
            </div>
            <div id="employee-courses-graph" data-title="Cursos de Empleados">
              <EmployeeCoursesGraph
                employeeCourses={informes?.informes.employeeCourses}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;