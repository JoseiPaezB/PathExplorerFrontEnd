"use client";
import { ChevronDown, Lock, Mail, Search, Trash } from "lucide-react";

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
import { UserInfoBanca } from "@/types/users";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UserInfoBanca[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<UserInfoBanca[]>([]);
  const [filtro, setFiltro] = useState<string>("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      const response = await fetch(
        "http://localhost:4000/api/banca/empleados",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setUsuarios(data.employees);
      setFilteredUsuarios(data.employees);
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
          <div className="space-y-4">
            {filteredUsuarios.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{user.nombre}</p>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
