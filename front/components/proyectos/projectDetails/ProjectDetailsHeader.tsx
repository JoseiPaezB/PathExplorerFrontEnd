"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProjectDetailsHeaderProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
}

export default function ProjectDetailsHeader({
  isEditMode,
  toggleEditMode,
}: ProjectDetailsHeaderProps) {
  return (
    <DialogHeader className="pb-2">
      <div className="flex justify-between items-center">
        <DialogTitle className="text-xl font-bold">
          {isEditMode ? "Editar Proyecto" : "Detalles del Proyecto"}
        </DialogTitle>
        {!isEditMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleEditMode}
            className="h-8 w-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
            <span className="sr-only">Edit</span>
          </Button>
        )}
      </div>
    </DialogHeader>
  );
}
