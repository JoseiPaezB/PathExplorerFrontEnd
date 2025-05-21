import { CourseAndCertificate } from "@/types/recommendations";

function RecommendationItem({ item }: { item: CourseAndCertificate }) {
  return (
    <div className="mb-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{item.nombre}</h4>
          <p className="text-sm text-muted-foreground">{item.descripcion}</p>
          <p className="text-sm mt-1">
            Justificacion:{" "}
            <span className="text-muted-foreground">
              {item.razon_recomendacion}
            </span>
          </p>
          <p className="text-sm">
            Institucion:{" "}
            <span className="text-muted-foreground">{item.institucion}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecommendationItem;
