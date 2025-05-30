export const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "activo":
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "en pausa":
    case "paused":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "completado":
    case "completed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "cancelado":
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const calculateProjectProgress = (
  startDate: string,
  endDate: string,
  status: string
): number => {
  if (status === "Completado" || status === "FINALIZADO") return 100;
  if (status === "Pendiente" || status === "PLANEACION") return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  if (today < start) return 0;
  if (today > end) return 99;

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = today.getTime() - start.getTime();

  return Math.round((elapsed / totalDuration) * 100);
};

export const formatDateForApi = (displayDate: string): string => {
  if (!displayDate) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
    return displayDate;
  }

  try {
    const parts = displayDate.split("/");
    if (parts.length !== 3) {
      console.error("Invalid date format:", displayDate);
      return "";
    }

    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const parsePriority = (
  priority: number | string | undefined
): number => {
  if (typeof priority === "number" && !isNaN(priority)) {
    return priority;
  }

  if (typeof priority === "string" && !isNaN(Number(priority))) {
    return Number(priority);
  }

  return 3;
};

export const getBadgeColor = (status: string): string => {
  switch (status) {
    case "Pendiente":
    case "PLANEACION":
      return "bg-yellow-50 text-yellow-700";
    case "En progreso":
    case "ACTIVO":
      return "bg-green-50 text-green-700";
    case "Completado":
    case "FINALIZADO":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

export const getBadgeImportance = (importance: number | string): string => {
  switch (importance) {
    case "Baja":
    case 1:
    case 2:
      return "bg-green-100 text-green-800 text-xs";
    case "Media":
    case 3:
    case 4:
      return "bg-yellow-100 text-yellow-800 text-xs";
    case "Alta":
    case 5:
      return "bg-red-100 text-red-800 text-xs";
    default:
      return "bg-gray-100 text-gray-800 text-xs";
  }
};
export const getImportanceText = (importance: number): string => {
  switch (importance) {
    case 1:
      return "Baja";
    case 3:
      return "Media";
    case 5:
      return "Alta";
    case 7:
      return "Crítica";
    default:
      return "Media";
  }
};

export const getInitials = (name: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
