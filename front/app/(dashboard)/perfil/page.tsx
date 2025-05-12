"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  CertificationsUserResponse,
  CoursesUserResponse,
  ProfessionalHistory,
  SkillsResponse,
  UserTrajectoryResponse,
} from "@/types/users";
import { useAuth } from "@/contexts/auth-context";
import { formatDate } from "@/lib/functions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail } from "lucide-react";
import CoursesAndCertificationsSection from "@/components/perfil/CoursesAndCertificationsSection";
import ProfessionalHistorySection from "@/components/perfil/ProfessionalHistorySection";
import SkillsSection from "@/components/perfil/SkillsSection";
import ProfessionalTrajectorySection from "@/components/perfil/ProfessionalTrajectorySection";

export default function PerfilPage() {
  const {
    user,
    professionalHistory: fetchProfessionalHistory,
    courses: fetchCourses,
    certifications: fetchCertifications,
    skills: fetchSkills,
    goalsAndTrajectory: fetchGoalsAndTrajectory,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("informacion");
  const [certifications, setCertifications] =
    useState<CertificationsUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professionalHistoryData, setProfessionalHistoryData] =
    useState<ProfessionalHistory | null>(null);
  const [coursesData, setCoursesData] = useState<CoursesUserResponse | null>(
    null
  );
  const [skills, setSkills] = useState<SkillsResponse | null>(null);
  const [goalsAndTrajectory, setGoalsAndTrajectory] =
    useState<UserTrajectoryResponse | null>(null);

  useEffect(() => {
    const loadProfessionalHistory = async () => {
      try {
        const history = await fetchProfessionalHistory();
        if (history) {
          setProfessionalHistoryData(history);
        }
      } catch (error) {
        console.error("Error fetching professional history:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching professional history."
        );
      }
    };

    loadProfessionalHistory();
  }, [fetchProfessionalHistory]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courses = await fetchCourses();
        if (courses) {
          setCoursesData(courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching courses."
        );
      }
    };

    loadCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setIsLoading(true);
        const certificationsData = await fetchCertifications();

        if (certificationsData?.certifications) {
          setCertifications(certificationsData);
        }
      } catch (error) {
        console.error("Error fetching certifications:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching certifications."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCertifications();
  }, [fetchCertifications]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skillsData = await fetchSkills();
        if (skillsData) {
          setSkills(skillsData);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching skills."
        );
      }
    };

    loadSkills();
  }, [fetchSkills]);

  useEffect(() => {
    const loadGoalsAndTrajectory = async () => {
      try {
        const goalsAndTrajectoryData = await fetchGoalsAndTrajectory();
        if (goalsAndTrajectoryData) {
          setGoalsAndTrajectory(goalsAndTrajectoryData);
        }
      } catch (error) {
        console.error("Error fetching goals and trajectory:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching goals and trajectory."
        );
      }
    };
    loadGoalsAndTrajectory();
  }, [fetchGoalsAndTrajectory]);

  return (
    <div className="space-y-6">
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
              <p className="text-lg text-muted-foreground">{`${user?.profile.puesto_actual}`}</p>
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
            courses={coursesData}
            certifications={certifications}
          />

          <ProfessionalHistorySection
            isLoading={isLoading}
            error={error}
            professionalHistory={professionalHistoryData}
          />
        </TabsContent>

        <TabsContent value="habilidades" className="space-y-4">
          <SkillsSection skills={skills} />
        </TabsContent>

        <TabsContent value="metas" className="space-y-4">
          <ProfessionalTrajectorySection userTrajectory={goalsAndTrajectory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
