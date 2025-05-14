import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { availableCharts, availableDataSets } from "@/constants/index";

function ExportDataModal({
  open,
  setOpen,
  handleExport,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleExport: (
    title: string,
    selectedFormat: string,
    selectedCharts: string[],
    selectedDataSets: string[]
  ) => void;
}) {
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [selectedDataSets, setSelectedDataSets] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("excel");
  const [title, setTitle] = useState<string>("informes");

  // Handle toggling individual chart selection
  const handleChartToggle = (chartId: string) => {
    setSelectedCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId) 
        : [...prev, chartId]
    );
  };

  // Handle toggling individual dataset selection
  const handleDatasetToggle = (datasetId: string) => {
    setSelectedDataSets(prev => 
      prev.includes(datasetId) 
        ? prev.filter(id => id !== datasetId) 
        : [...prev, datasetId]
    );
  };

  // Handle "Select All" for charts
  const handleSelectAllCharts = () => {
    if (selectedCharts.length === availableCharts.length) {
      // If all are selected, deselect all
      setSelectedCharts([]);
    } else {
      // Otherwise, select all
      setSelectedCharts(availableCharts.map(chart => chart.id));
    }
  };

  // Handle "Select All" for datasets
  const handleSelectAllDatasets = () => {
    if (selectedDataSets.length === availableDataSets.length) {
      // If all are selected, deselect all
      setSelectedDataSets([]);
    } else {
      // Otherwise, select all
      setSelectedDataSets(availableDataSets.map(dataset => dataset.id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Detalles de la exportación
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="filename">Nombre del archivo</Label>
            <input
              id="filename"
              type="text"
              className="w-full border rounded-md p-2 mt-1"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </div>

          <div>
            <Label htmlFor="format">Formato de exportación</Label>
            <select
              id="format"
              className="w-full border rounded-md p-2 mt-1"
              onChange={(e) => setSelectedFormat(e.target.value)}
              value={selectedFormat}
            >
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label className="font-medium">Gráficos a incluir</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAllCharts}
                className="text-xs py-1"
              >
                {selectedCharts.length === availableCharts.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-1">
              {availableCharts.map((chart) => (
                <div className="flex items-center space-x-2" key={chart.id}>
                  <input
                    type="checkbox"
                    id={chart.id}
                    className="rounded"
                    checked={selectedCharts.includes(chart.id)}
                    onChange={() => handleChartToggle(chart.id)}
                  />
                  <Label htmlFor={chart.id}>{chart.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label className="font-medium">Datos a incluir</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAllDatasets}
                className="text-xs py-1"
              >
                {selectedDataSets.length === availableDataSets.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-1">
              {availableDataSets.map((dataSet) => (
                <div className="flex items-center space-x-2" key={dataSet.id}>
                  <input
                    type="checkbox"
                    id={dataSet.id}
                    className="rounded"
                    checked={selectedDataSets.includes(dataSet.id)}
                    onChange={() => handleDatasetToggle(dataSet.id)}
                  />
                  <Label htmlFor={dataSet.id}>{dataSet.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() =>
              handleExport(
                title,
                selectedFormat,
                selectedCharts,
                selectedDataSets
              )
            }
          >
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExportDataModal;