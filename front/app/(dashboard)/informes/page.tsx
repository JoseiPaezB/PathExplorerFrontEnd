"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfessionalGoalsGraph from "@/components/informes/metas-profesionales/ProfessionalGoalsGraph";
import ProfessionalTrajectoryGraph from "@/components/informes/metas-profesionales/ProfessionalTrajectoryGraph";
import EmployeeStateBarGraph from "@/components/informes/metas-profesionales/EmployeeStateBarGraph";
import MostRequiredSkillsForRoleGraph from "@/components/informes/recursos-requeridos/MostRequiredSkillsForRoleGraph";
import EmployeeCertificationsGraph from "@/components/informes/empleados-desarrollo/EmployeeCertificationsGraph";
import EmployeeCoursesGraph from "@/components/informes/empleados-desarrollo/EmployeeCoursesGraph";
import EmployeeEvaluationsGraph from "@/components/informes/recursos-requeridos/EmployeeEvaluationsGraph";
import { fetchGetAllInformes } from "@/hooks/fetchGetAllInformes";

function page() {
  const { informes, isLoading, error } = fetchGetAllInformes();
  const [activeTab, setActiveTab] = useState("desarrollo");

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="desarrollo">Desarollo profesional</TabsTrigger>
          <TabsTrigger value="asignacion">Asignaciones</TabsTrigger>
          <TabsTrigger value="empleados">Aprendizaje de empleados</TabsTrigger>
        </TabsList>

        <TabsContent value="desarrollo" className="space-y-4 pt-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProfessionalGoalsGraph
              professionalGoals={informes?.informes.professionalGoals}
            />
            <ProfessionalTrajectoryGraph
              professionalTrajectory={informes?.informes.professionalTrayectory}
            />
            <EmployeeStateBarGraph
              employeesStates={informes?.informes.employeesStates}
            />
          </div>
        </TabsContent>

        <TabsContent value="asignacion" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 ">
            <MostRequiredSkillsForRoleGraph
              requiredAbilitiesForRoles={
                informes?.informes.requiredAbilitiesForRoles
              }
              roles={informes?.informes.roles}
            />
            <EmployeeEvaluationsGraph
              employeeEvaluations={informes?.informes.employeeEvaluations}
            />
          </div>
        </TabsContent>
        <TabsContent value="empleados" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <EmployeeCertificationsGraph
              employeeCertifications={informes?.informes.employeeCertifications}
            />
            <EmployeeCoursesGraph
              employeeCourses={informes?.informes.employeeCourses}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
