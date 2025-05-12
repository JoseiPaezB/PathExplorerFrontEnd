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
import { TabsContent } from "@/components/ui/tabs";

interface FormPasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserUpdatePasswordFormProps {
  formPasswordState: FormPasswordState;
  isSubmitting: boolean;
  getStatusMessage: () => React.ReactNode;
  setFormPasswordState: React.Dispatch<React.SetStateAction<FormPasswordState>>;
  setFormError: React.Dispatch<React.SetStateAction<string | null>>;
  setFormSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  updatePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

function UserUpdatePasswordForm({
  formPasswordState,
  isSubmitting,
  getStatusMessage,
  setFormPasswordState,
  setFormError,
  setFormSuccess,
  setIsSubmitting,
  updatePassword,
}: UserUpdatePasswordFormProps) {
  const handleInputChangePassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormPasswordState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
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
      const success = await updatePassword(
        formPasswordState.currentPassword,
        formPasswordState.newPassword
      );
      if (success) {
        setFormSuccess(true);

        setFormPasswordState({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          setFormSuccess(false);
        }, 3000);
      } else {
        setFormSuccess(false);
        const hookError = "Error al actualizar la contraseña";
        setFormError(hookError);
      }
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
  return (
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
  );
}

export default UserUpdatePasswordForm;
