import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProjectFormData } from "@/types/projectsAdministration";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function NewProjectDialog({
  formData,
  handleChange,
  handleSelectChange,
  handleStartDateChange,
  handleEndDateChange,
  startDate,
  endDate,
}: {
  formData: ProjectFormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (
    name: keyof typeof formData,
    value: string | number
  ) => void;
  handleStartDateChange: (date: Date | undefined) => void;
  handleEndDateChange: (date: Date | undefined) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del proyecto</Label>
        <Input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ingrese el nombre del proyecto"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describa el proyecto brevemente"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha de inicio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Fecha de finalización estimada</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                disabled={(date: Date) =>
                  startDate ? date < startDate : false
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prioridad">Prioridad</Label>
          <Select
            value={formData.prioridad.toString()}
            onValueChange={(value) =>
              handleSelectChange("prioridad", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Baja</SelectItem>
              <SelectItem value="2">Media</SelectItem>
              <SelectItem value="3">Alta</SelectItem>
              <SelectItem value="4">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
