"use server";
import axios from "axios";
import {
  CertificationsUserResponse,
  ProfessionalHistory,
  UserTrajectoryResponse,
  CoursesUserResponse,
  SkillsResponse,
} from "@/types/users";

const API_URL = "http://localhost:4000/api";

export async function getUserCourses(
  userId?: string,
  token?: string
): Promise<CoursesUserResponse> {
  try {
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get<CoursesUserResponse>(
      `${API_URL}/auth/courses?id_persona=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Error fetching courses");
    }
  } catch (error) {
    console.error("Courses fetch error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
    throw error;
  }
}

export async function getUserCertifications(
  userId?: string,
  token?: string
): Promise<CertificationsUserResponse> {
  try {
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get<CertificationsUserResponse>(
      `${API_URL}/auth/certifications?id_persona=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Error fetching Certifications");
    }
  } catch (error) {
    console.error("Certifications fetch error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch Certifications"
      );
    }
    throw error;
  }
}

export async function getUserProfessionalHistory(
  userId?: string,
  token?: string
): Promise<ProfessionalHistory> {
  try {
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get<ProfessionalHistory>(
      `${API_URL}/auth/professional-history?id_persona=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Error fetching Professional History");
    }
  } catch (error) {
    console.error("Professional History fetch error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch Professional History"
      );
    }
    throw error;
  }
}

export async function getUserTrajectoryAndGoals(
  userId?: string,
  token?: string
): Promise<UserTrajectoryResponse> {
  try {
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get<UserTrajectoryResponse>(
      `${API_URL}/auth/trajectory-and-goals?id_persona=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Error fetching goals and trajectory");
    }
  } catch (error) {
    console.error("Goals and trajectory fetch error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch goals and trajectory"
      );
    }
    throw error;
  }
}

export async function getUserSkills(
  userId?: string,
  token?: string
): Promise<SkillsResponse> {
  try {
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get<SkillsResponse>(
      `${API_URL}/auth/skills?id_persona=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Error fetching skills");
    }
  } catch (error) {
    console.error("Skills fetch error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch skills"
      );
    }
    throw error;
  }
}
