"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserInfoBanca } from "@/types/users";
import { useFetchGetEmpleadosBanca } from "@/hooks/fetchGetEmpleadosBanca";
import UsuariosHeader from "@/components/usuarios/UsuariosHeader";
import UsuariosList from "@/components/usuarios/UsuariosList";

export default function UsuariosPage() {
  const router = useRouter();
  const { empleadosBanca, isLoading, error } = useFetchGetEmpleadosBanca();
  const [filteredUsuarios, setFilteredUsuarios] = useState<UserInfoBanca[]>([]);

  useEffect(() => {
    if (empleadosBanca?.employees && empleadosBanca.employees.length > 0) {
      setFilteredUsuarios(empleadosBanca.employees);
    }
  }, [empleadosBanca]);

  const applyFilters = (searchTerm: string, stateFilter: string) => {
    searchTerm = searchTerm.toLowerCase();

    let result = empleadosBanca?.employees;
    if (!result) return;

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

      <UsuariosHeader applyFilters={applyFilters} />

      <UsuariosList
        filteredUsuarios={filteredUsuarios}
        isLoading={isLoading}
        error={error}
        router={router}
      />
    </div>
  );
}
