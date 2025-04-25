"use client";
import { ChevronDown, Mail, Search, User, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState, useEffect } from "react";
import { UserInfoBanca, UserInfoBancaResponse } from "@/types/users";
import { getEmpleadosBanca } from "./actions";

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UserInfoBanca[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<UserInfoBanca[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setIsLoading(true);
        const data = (await getEmpleadosBanca(
          localStorage.getItem("token") || ""
        )) as UserInfoBancaResponse;
        const employeesList = Array.isArray(data.employees)
          ? data.employees
          : [];

        setUsuarios(employeesList);
        setFilteredUsuarios(employeesList);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsuarios([]);
        setFilteredUsuarios([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleFilter = (filtro: string) => {
    setFiltro(filtro);
    applyFilters("", filtro);
  };

  const applyFilters = (searchTerm: string, stateFilter: string) => {
    searchTerm = searchTerm.toLowerCase();

    let result = usuarios;

    if (stateFilter) {
      result = result.filter((user) => user.estado === stateFilter);
    }

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.nombre.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredUsuarios(result);
  };

  const userSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    applyFilters(searchTerm, filtro);
  };

  const navigateToUserDetails = (user: UserInfoBanca) => {
    sessionStorage.setItem("selectedUser", JSON.stringify(user));
    router.push(`/usuarios/${user.id_persona}/ver-perfil`);
  };

  const navigateToUserState = (user: UserInfoBanca) => {
    router.push(`/usuarios/${user.id_empleado}/ver-estado`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="w-full rounded-md border border-input bg-white pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onChange={userSearch}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <span>Estado</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleFilter("ASIGNADO")}>
              ASIGNADO
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilter("BANCA")}>
              BANCA
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilter("")}>
              Todos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
    </div>
  );
}
