"use client";

import { useState, useEffect } from "react";
import { Key } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { updatePassword } from "./actions";

interface FormState {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
}

interface FormPasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ConfiguracionPage() {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("cuenta");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    correo: user?.email || "",
    cargo: user?.profile?.puesto_actual || "",
  });
  const [formPasswordState, setFormPasswordState] = useState<FormPasswordState>(
    {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleInputChangePassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormPasswordState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await updateUserProfile({
        nombre: formState.nombre,
        apellido: formState.apellido,
        correo: formState.correo,
        cargo: formState.cargo,
      });

      setFormSuccess(true);

      setTimeout(() => {
        setFormSuccess(false);
      }, 3000);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Error al actualizar los datos"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formPasswordState.currentPassword ||
      formPasswordState.currentPassword.trim() === ""
    ) {
      setFormError("La contraseña actual es obligatoria");
      return;
    }

    if (
      !formPasswordState.newPassword ||
      formPasswordState.newPassword.trim() === ""
    ) {
      setFormError("La nueva contraseña es obligatoria");
      return;
    }
    if (
      !formPasswordState.confirmPassword ||
      formPasswordState.confirmPassword.trim() === ""
    ) {
      setFormError("La confirmación de la nueva contraseña es obligatoria");
      return;
    }

    if (formPasswordState.newPassword !== formPasswordState.confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return;
    }
    try {
      setIsSubmitting(true);
      setFormError(null);
      const token = localStorage.getItem("token") || "";
      await updatePassword(
        formPasswordState.currentPassword,
        formPasswordState.newPassword,
        token
      );
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
      }, 3000);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Error al actualizar la contraseña"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusMessage = () => {
    if (formSuccess) {
      return (
        <p className="text-green-600 text-sm mt-2">
          Cambios guardados correctamente
        </p>
      );
    }
    if (formError) {
      return <p className="text-red-600 text-sm mt-2">{formError}</p>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra tus preferencias y configuración de cuenta
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="cuenta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información personal y detalles de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleEdit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      placeholder="Juan"
                      value={formState.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      placeholder="Díaz"
                      value={formState.apellido}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correo">Correo electrónico</Label>
                    <Input
                      id="correo"
                      type="email"
                      placeholder="juan.diaz@empresa.com"
                      value={formState.correo}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    placeholder="Desarrollador Full Stack Senior"
                    value={formState.cargo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-4">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                  </Button>
                  {getStatusMessage()}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formPasswordState.currentPassword}
                    onChange={handleInputChangePassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formPasswordState.newPassword}
                    onChange={handleInputChangePassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmar nueva contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formPasswordState.confirmPassword}
                    onChange={handleInputChangePassword}
                  />
                </div>
                <div className="mt-4">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Guardando..." : "Cambiar contraseña"}
                  </Button>
                </div>
                {getStatusMessage()}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
