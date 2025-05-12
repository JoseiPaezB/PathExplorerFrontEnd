import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdateProfileData } from "@/types/users";
import { User } from "@/types/auth";
interface UserFormData {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
}

interface UserUpdateFormProps {
  setFormState: React.Dispatch<React.SetStateAction<UserFormData>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setFormError: React.Dispatch<React.SetStateAction<string | null>>;
  formState: UserFormData;
  updateUserProfile: (profileData: UpdateProfileData) => Promise<void | User>;
  setFormSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  getStatusMessage: () => React.ReactNode;
  isSubmitting: boolean;
}

function UserUpdateForm({
  setFormState,
  setIsSubmitting,
  setFormError,
  formState,
  updateUserProfile,
  setFormSuccess,
  getStatusMessage,
  isSubmitting,
}: UserUpdateFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
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
  return (
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
  );
}

export default UserUpdateForm;
