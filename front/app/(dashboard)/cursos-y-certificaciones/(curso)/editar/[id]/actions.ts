"use server";

import { revalidatePath } from "next/cache";
import { Course, CourseFormData } from "@/types/courses";

export async function editUserCourse(
  courseData: CourseFormData,
  token?: string
) {
  if (!courseData.id_curso) {
    throw new Error("ID del curso es requerido");
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      "http://localhost:4000/api/development/edit-course",
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(courseData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar el curso");
    }

    revalidatePath("/cursos-y-certificaciones");
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    throw error;
  }
}
