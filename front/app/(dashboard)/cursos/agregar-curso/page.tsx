import React from "react";

function page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agregar curso</h1>
          <p className="text-muted-foreground">
            Agrega los detalles del curso que deseas crear
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
