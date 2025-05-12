"use client";
import { use } from "react";
import { params } from "@/types/parameters";
import { useFetchUserProjects } from "@/hooks/fetchUserProjects";
import NoUserProjectState from "@/components/estado/NoUserProjectState";
import HasUserProjectState from "@/components/estado/HasUserProjectState";
import { useRouter } from "next/navigation";
export default function UserStatePage({ params }: { params: params }) {
  const unwrappedParams: params = use(params);
  const employeeId = unwrappedParams.id;
  const router = useRouter();
  const {
    projects,
    isLoading,
    error: fetchError,
  } = useFetchUserProjects(parseFloat(employeeId));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
        <span>Error: {fetchError}</span>
      </div>
    );
  }

  if (!projects?.userProject || projects.userProject.length === 0) {
    return <NoUserProjectState router={router} />;
  }

  const project = projects?.userProject[0];
  const role = projects?.userRole?.[0];

  return (
    <HasUserProjectState
      project={project}
      projects={projects}
      role={role}
      router={router}
    />
  );
}
