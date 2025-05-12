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
