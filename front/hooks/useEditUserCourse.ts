"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { CourseFormData } from "@/types/courses";

export function useEditUserCourse() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateCourse, setUpdateCourse] = useState<CourseFormData | null>(null);

  const editCourse = async (courseData: CourseFormData): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${apiUrl}/development/edit-course`,
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUpdateCourse(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Error updating course";

      setError(errorMessage);
      console.error("Error editing course:", err);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateCourse,
    editCourse,
  };
}