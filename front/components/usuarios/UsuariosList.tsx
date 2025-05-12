import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, User } from "lucide-react";
import { UserInfoBanca } from "@/types/users";

function UsuariosList({
  isLoading,
  error,
  filteredUsuarios,
  router,
}: {
  isLoading: boolean;
  error: string | null;
  filteredUsuarios: UserInfoBanca[];
  router: any;
}) {
  const navigateToUserDetails = (user: UserInfoBanca) => {
    sessionStorage.setItem("selectedUser", JSON.stringify(user));
    router.push(`/usuarios/${user.id_persona}/ver-perfil`);
  };

  const navigateToUserState = (user: UserInfoBanca) => {
    router.push(`/usuarios/${user.id_empleado}/ver-estado`);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3">Cargando usuarios...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error al cargar usuarios: {error}
          </div>
        ) : filteredUsuarios.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron usuarios que coincidan con los criterios de
            búsqueda.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsuarios.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div
                  className="flex items-center gap-4 flex-1"
                  onClick={() => navigateToUserDetails(user)}
                >
                  <div>
                    <p className="font-medium">
                      {user.nombre} {user.apellido || ""}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        user.estado === "ASIGNADO"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }
                    >
                      {user.estado}
                    </Badge>
                  </div>
                  <Badge>{user.puesto_actual}</Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => navigateToUserDetails(user)}
                    >
                      <User className="h-4 w-4" />
                      <span>Ver perfil</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => navigateToUserState(user)}
                    >
                      <Edit className="h-4 w-4" />
                      <span>Ver proyecto</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UsuariosList;
