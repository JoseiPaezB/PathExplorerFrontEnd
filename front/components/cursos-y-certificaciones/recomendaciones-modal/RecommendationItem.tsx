import { CourseAndCertificate } from "@/types/recommendations";
import { useState, useEffect } from "react";

function RecommendationItem({
  item,
  delay = 0,
}: {
  item: CourseAndCertificate;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        mb-2 rounded-md border p-3 
        transition-all duration-500 ease-out transform
        ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }
      `}
      style={{
        transitionDelay: isVisible ? "0ms" : `${delay}ms`,
      }}
    >
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
