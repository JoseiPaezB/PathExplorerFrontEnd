import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/functions";
import { Calendar, Mail } from "lucide-react";
import { UserInfoBanca } from "@/types/users";
function ProfileHeader({ user }: { user: UserInfoBanca | null }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage
              src="/placeholder.svg?height=96&width=96"
              alt="Juan Díaz"
            />
            <AvatarFallback className="text-2xl">JD</AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <p className="text-lg text-muted-foreground">{`${user?.puesto_actual}`}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span> {formatDate(user?.fecha_contratacion || "")}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileHeader;
