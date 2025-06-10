"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserInfoBanca } from "@/types/users";
import { params } from "@/types/parameters";
import { useFetchUserCourses } from "@/hooks/fetchUserCourses";
import { useFetchUserCertifications } from "@/hooks/fetchUserCertifications";
import { useFetchUserSkills } from "@/hooks/fetchUserSkills";
import { useFetchUserTrajectory } from "@/hooks/fetchUserTrajectory";
import { useFetchUserProfessionalHistory } from "@/hooks/fetchUserProfessionalHistory";
import ProfileHeader from "@/components/perfil/ProfileHeader";
import CoursesAndCertificationsSection from "@/components/perfil/CoursesAndCertificationsSection";
import ProfessionalHistorySection from "@/components/perfil/ProfessionalHistorySection";
import SkillsSection from "@/components/perfil/SkillsSection";
import ProfessionalTrajectorySection from "@/components/perfil/ProfessionalTrajectorySection";

export default function UserDetailsPage({ params }: { params: params }) {
  const unwrappedParams: params = use(params);
  const userId = unwrappedParams.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("informacion");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfoBanca | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    skills,
    isLoading: skillsLoading,
    error: skillsError,
  } = useFetchUserSkills(userId);
  const {
    courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useFetchUserCourses(userId);
  const {
    certifications,
    isLoading: certificationsLoading,
    error: certificationsError,
  } = useFetchUserCertifications(userId);
  const {
    professionalHistory,
    isLoading: professionalHistoryLoading,
    error: professionalHistoryError,
  } = useFetchUserProfessionalHistory(userId);
  const {
    trajectory,
    isLoading: userTrajectoryLoading,
    error: userTrajectoryError,
  } = useFetchUserTrajectory(userId);
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("selectedUser");
      setLoading(true);

      if (storedUser) {
        const userData = JSON.parse(storedUser) as UserInfoBanca;
        if (userData.id_persona.toString() === userId) {
          setUser(userData);
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Error parsing user data");
      console.error("Error retrieving user data:", err);
      setLoading(false);
    }
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a usuarios</span>
        </Button>
      </div>

      <ProfileHeader user={user} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
          <TabsTrigger value="metas">Metas Profesionales</TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="space-y-4">
          <CoursesAndCertificationsSection
            courses={courses}
            certifications={certifications}
          />

          <ProfessionalHistorySection
            error={error}
            professionalHistory={professionalHistory}
          />
        </TabsContent>

        <TabsContent value="habilidades" className="space-y-4">
          <SkillsSection skills={skills} />
        </TabsContent>

        <TabsContent value="metas" className="space-y-4">
          <ProfessionalTrajectorySection userTrajectory={trajectory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
