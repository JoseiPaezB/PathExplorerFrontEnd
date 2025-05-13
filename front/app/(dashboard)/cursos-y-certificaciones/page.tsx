"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { CoursesUserResponse, CertificationsUserResponse } from "@/types/users";
import CursosYCertificacionesHeader from "@/components/cursos-y-certificaciones/CursosYCertificacionesHeader";
import SearchBar from "@/components/cursos-y-certificaciones/SearchBar";
import CoursesInProgress from "@/components/cursos-y-certificaciones/CoursesInProgress";
import CoursesCompleted from "@/components/cursos-y-certificaciones/CoursesCompleted";
import CertificationsSection from "@/components/cursos-y-certificaciones/CertificationsSection";

export default function CursosPage() {
  const [activeTab, setActiveTab] = useState("en-curso");
  const [userCourses, setUserCourses] = useState<CoursesUserResponse>();
  const [error, setError] = useState<string | null>(null);
  const [userCertifications, setUserCertifications] =
    useState<CertificationsUserResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const { courses, certifications } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await courses();

        if (coursesData) {
          setUserCourses(coursesData);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
      }
    };

    fetchCourses();
  }, [courses]);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const certificationsData = await certifications();

        if (certificationsData) {
          setUserCertifications(certificationsData);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching certifications:", err);
        setError("Failed to load certifications");
      }
    };

    fetchCertifications();
  }, [certifications]);

  const getFilteredCourses = (
    courses: CoursesUserResponse | undefined,
    completed = false
  ) => {
    if (!courses?.courses) return [];

    return courses.courses.filter((course) => {
      const completionMatch = completed
        ? !!course.calificacion
        : !course.calificacion;

      const searchMatch =
        searchTerm === "" ||
        course.nombre.toLowerCase().includes(searchTerm) ||
        course.descripcion.toLowerCase().includes(searchTerm);

      return completionMatch && searchMatch;
    });
  };

  const getFilteredCertifications = () => {
    if (!userCertifications?.certifications) return [];

    return userCertifications.certifications.filter(
      (cert) =>
        searchTerm === "" ||
        cert.Nombre.toLowerCase().includes(searchTerm) ||
        cert.Institucion.toLowerCase().includes(searchTerm)
    );
  };

  return (
    <div className="space-y-6">
      <CursosYCertificacionesHeader />

      <SearchBar
        activeTab={activeTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setSearchTerm("");
        }}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="en-curso">En Curso</TabsTrigger>
          <TabsTrigger value="completados">Completados</TabsTrigger>
          <TabsTrigger value="certificaciones">Certificaciones</TabsTrigger>
        </TabsList>

        <CoursesInProgress
          getFilteredCourses={getFilteredCourses}
          courses={userCourses}
        />

        <CoursesCompleted
          getFilteredCourses={getFilteredCourses}
          userCourses={userCourses}
        />

        <CertificationsSection
          getFilteredCertifications={getFilteredCertifications}
          refreshCertifications={() => {
            const fetchCertifications = async () => {
              try {
                const certificationsData = await certifications();
                if (certificationsData) {
                  setUserCertifications(certificationsData);
                }
                setError(null);
              } catch (err) {
                console.error("Error refreshing certifications:", err);
                setError("Failed to refresh certifications");
              }
            };
            fetchCertifications();
          }}
        />
      </Tabs>
    </div>
  );
}
