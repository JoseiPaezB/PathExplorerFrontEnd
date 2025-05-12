"use client";

import { EditableProject } from "@/types/projectsAdministration";

interface ProjectEditFormProps {
  editedProject: EditableProject | null;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function ProjectEditForm({
  editedProject,
  handleChange,
}: ProjectEditFormProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-1">
        <label className="block text-sm text-gray-600" htmlFor="projectName">
          Nombre del Proyecto
        </label>
        <input
          type="text"
          id="projectName"
          name="project"
          value={editedProject?.project || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-gray-600" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={editedProject?.description || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm text-gray-600" htmlFor="startDate">
            Fecha Inicio
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={editedProject?.startDate || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-gray-600" htmlFor="endDate">
            Fecha Fin Estimada
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={editedProject?.endDate || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-gray-600" htmlFor="priority">
          Prioridad
        </label>
        <select
          id="priority"
          name="priority"
          value={editedProject?.priority || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="1">Baja</option>
          <option value="3">Media</option>
          <option value="5">Alta</option>
        </select>
      </div>
    </div>
  );
}
