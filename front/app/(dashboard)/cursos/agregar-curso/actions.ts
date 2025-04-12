"use server";

import { revalidatePath } from "next/cache";

export type Course = {
  id_curso: number;
  nombre: string;
  institucion: string;
  descripcion: string;
  duracion: number;
  modalidad: string;
};

export type CourseFormData = {
  id_curso: number;
  fecha_inicio: string;
  fecha_finalizacion: string;
  calificacion: number | null;
  certificado: string;
};
export async function getCourses(token?: string): Promise<Course[]> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:4000/api/development/all-courses`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al obtener cursos: ${errorData?.message || response.statusText}`
      );
    }

    const courses: Course[] = await response.json();
    return courses;
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    return [];
  }
}

export async function addCourse(
  formData: CourseFormData,
  token?: string
): Promise<Course> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      "http://localhost:4000/api/development/create-course",
      {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al agregar curso: ${errorData?.message || response.statusText}`
      );
    }

    revalidatePath("/cursos");

    return await response.json();
  } catch (error) {
    console.error("Error guardando curso:", error);
    throw error;
  }
}
