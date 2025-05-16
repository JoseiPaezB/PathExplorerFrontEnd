import React from "react";
import { Button } from "@/components/ui/button";

function CreateTrajectoryForm() {
  return (
    <div>
      <h2>Crear Nueva Trayectoria</h2>
      <form>
        {/* Aquí puedes agregar campos de formulario según sea necesario */}
        <Button type="submit">Guardar Trayectoria</Button>
      </form>
    </div>
  );
}

export default CreateTrajectoryForm;
