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
import { RectRadius } from "recharts/types/shape/Rectangle";
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
            <Label className="font-medium">Gráficos a incluir</Label>
            <div className="grid grid-cols-1 gap-2 mt-1">
              {availableCharts.map((chart) => (
                <div className="flex items-center space-x-2" key={chart.id}>
                  <input
                    type="checkbox"
                    id={chart.id}
                    className="rounded"
                    onClick={() =>
                      setSelectedCharts((prev) => [...prev, chart.id])
                    }
                  />
                  <Label htmlFor={chart.id}>{chart.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="font-medium">Datos a incluir</Label>
            <div className="grid grid-cols-1 gap-2 mt-1">
              {availableDataSets.map((dataSet) => (
                <div className="flex items-center space-x-2" key={dataSet.id}>
                  <input
                    type="checkbox"
                    id={dataSet.id}
                    className="rounded"
                    onClick={() =>
                      setSelectedDataSets((prev) => [...prev, dataSet.id])
                    }
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
