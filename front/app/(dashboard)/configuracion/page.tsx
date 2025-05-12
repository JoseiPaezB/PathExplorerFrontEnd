"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";
import UserUpdateForm from "@/components/configuracion/UserUpdateForm";
import UserUpdatePasswordForm from "@/components/configuracion/UserUpdatePasswordForm";

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
  const { updatePassword } = useUpdatePassword();
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

        <UserUpdateForm
          formState={formState}
          setFormState={setFormState}
          setIsSubmitting={setIsSubmitting}
          setFormError={setFormError}
          updateUserProfile={updateUserProfile}
          setFormSuccess={setFormSuccess}
          getStatusMessage={getStatusMessage}
          isSubmitting={isSubmitting}
        />

        <UserUpdatePasswordForm
          formPasswordState={formPasswordState}
          setFormPasswordState={setFormPasswordState}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          setFormError={setFormError}
          setFormSuccess={setFormSuccess}
          getStatusMessage={getStatusMessage}
          updatePassword={updatePassword}
        />
      </Tabs>
    </div>
  );
}
