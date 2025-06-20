"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { AuthState, User, LoginResponse, JwtPayload, UpdateProfileData } from "@/types/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type {
  CoursesUserResponse,
  CertificationsUserResponse,
  SkillsResponse,
  ProfessionalHistory,
  UserTrajectoryResponse,
} from "@/types/users";
import type { NotificationResponse } from "@/types/notificaciones";
import { apiUrl } from "@/constants";
import type { SignupFormData } from "../hooks/useSignUp";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User | void>;
  signup: (formData: SignupFormData) => Promise<User | void>; // ← Add this
  logout: () => void;
  updateUserProfile: (profileData: UpdateProfileData) => Promise<User | void>;
  courses: () => Promise<CoursesUserResponse | void>;
  certifications: () => Promise<CertificationsUserResponse | void>;
  professionalHistory: () => Promise<ProfessionalHistory | null>;
  skills: () => Promise<SkillsResponse | null>;
  goalsAndTrajectory: () => Promise<UserTrajectoryResponse | null>;
  notifications: () => Promise<NotificationResponse | null>;
  uploadCV: (file: File) => Promise<any>;
  extractCVPreview: (file: File) => Promise<any>;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie =
      name + "=" + encodeURIComponent(value) + expires + "; path=/";
};

const deleteCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};


const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    deleteCookie("user");
    setState({ user: null, isAuthenticated: false });
  }, []);

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        if (isTokenExpired(token)) {
          console.log("Token expired, logging out");
          clearAuthData();
          router.push("/login");
          return;
        }

        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setState({
            user: parsedUser,
            isAuthenticated: true,
          });

          setCookie("user", storedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          clearAuthData();
        }
      }
    };

    init();
  }, [clearAuthData, router]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        console.log("Token expired during session, logging out");
        clearAuthData();
        router.push("/login");
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [clearAuthData, router]);


  const signup = useCallback(
  async (formData: SignupFormData): Promise<User | void> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${apiUrl}/auth/signup`,
        formData
      );

      if (
        response.data.success &&
        response.data.token &&
        response.data.user
      ) {
        const { token, user } = response.data;

        if (isTokenExpired(token)) {
          throw new Error("Received expired token from server");
        }

        const userString = JSON.stringify(user);

        localStorage.setItem("token", token);
        localStorage.setItem("user", userString);
        setCookie("user", userString);

        setState({
          user,
          isAuthenticated: true,
        });

        return user;
      } else {
        throw new Error(response.data.message || "Error en el registro");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Error en el registro";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  []
);



  const login = useCallback(
      async (email: string, password: string): Promise<User | void> => {
        try {
          const response = await axios.post<LoginResponse>(
              `${apiUrl}/auth/login`,
              {
                email,
                password,
              }
          );

          if (
              response.data.success &&
              response.data.token &&
              response.data.user
          ) {
            const { token, user } = response.data;

            if (isTokenExpired(token)) {
              throw new Error("Received expired token from server");
            }

            const userString = JSON.stringify(user);

            localStorage.setItem("token", token);
            localStorage.setItem("user", userString);
            setCookie("user", userString);

            setState({
              user,
              isAuthenticated: true,
            });

            return user;
          } else {
            throw new Error(response.data.message || "Credenciales inválidas");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error("Autenticación fallida");
          }
          throw error;
        }
      },
      [router]
  );

  const courses = useCallback(async (): Promise<CoursesUserResponse | void> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      if (isTokenExpired(token)) {
        clearAuthData();
        router.push("/login");
        throw new Error("Session expired. Please login again.");
      }

      const response = await axios.get<CoursesUserResponse>(
          `${apiUrl}/auth/courses`,
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
  }, [clearAuthData, router]);

  const certifications =
      useCallback(async (): Promise<CertificationsUserResponse | void> => {
        try {
          const token = localStorage.getItem("token");

          if (!token) {
            throw new Error("No authentication token found");
          }

          if (isTokenExpired(token)) {
            clearAuthData();
            router.push("/login");
            throw new Error("Session expired. Please login again.");
          }

          const response = await axios.get<CertificationsUserResponse>(
              `${apiUrl}/auth/certifications`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
          );

          if (response.data) {
            return response.data;
          } else {
            throw new Error("Error fetching certifications");
          }
        } catch (error) {
          console.error("Certifications fetch error:", error);
          if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to fetch certifications"
            );
          }
          throw error;
        }
      }, [clearAuthData, router]);

  const professionalHistory =
      useCallback(async (): Promise<ProfessionalHistory | null> => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }
          if (isTokenExpired(token)) {
            clearAuthData();
            router.push("/login");
            throw new Error("Session expired. Please login again.");
          }
          const response = await axios.get<ProfessionalHistory>(
              `${apiUrl}/auth/professional-history`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
          );
          if (response.data) {
            return response.data;
          } else {
            throw new Error("Error fetching professional history");
          }
        } catch (error) {
          console.error("Professional history fetch error:", error);
          if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to fetch professional history"
            );
          }
          throw error;
        }
      }, [clearAuthData, router]);

  const skills = useCallback(async (): Promise<SkillsResponse | null> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      if (isTokenExpired(token)) {
        clearAuthData();
        router.push("/login");
        throw new Error("Session expired. Please login again.");
      }
      const response = await axios.get<SkillsResponse>(
          `${apiUrl}/auth/skills`,
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
  }, [clearAuthData, router]);

  const goalsAndTrajectory =
      useCallback(async (): Promise<UserTrajectoryResponse | null> => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }
          if (isTokenExpired(token)) {
            clearAuthData();
            router.push("/login");
            throw new Error("Session expired. Please login again.");
          }
          const response = await axios.get<UserTrajectoryResponse>(
              `${apiUrl}/auth/trajectory-and-goals`,
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
                error.response?.data?.message ||
                "Failed to fetch goals and trajectory"
            );
          }
          throw error;
        }
      }, [clearAuthData, router]);

  const notifications =
      useCallback(async (): Promise<NotificationResponse | null> => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }
          if (isTokenExpired(token)) {
            clearAuthData();
            router.push("/login");
            throw new Error("Session expired. Please login again.");
          }
          const response = await axios.get<NotificationResponse>(
              `${apiUrl}/notifications/user-notifications`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
          );
          if (response.data) {
            return response.data;
          } else {
            throw new Error("Error fetching user notifications");
          }
        } catch (error) {
          console.error("User notifications fetch error:", error);
          if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to fetch user notifications"
            );
          }
          throw error;
        }
      }, [clearAuthData, router]);

  const uploadCV = useCallback(async (file: File): Promise<any> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      if (isTokenExpired(token)) {
        clearAuthData();
        router.push("/login");
        throw new Error("Session expired. Please login again.");
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
          `${apiUrl}/cv/upload-and-save`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading CV:", error);
      throw error;
    }
  }, [clearAuthData, router]);

  const extractCVPreview = useCallback(async (file: File): Promise<any> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      if (isTokenExpired(token)) {
        clearAuthData();
        router.push("/login");
        throw new Error("Session expired. Please login again.");
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
          `${apiUrl}/cv/extract-preview`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
      );

      return response.data;
    } catch (error) {
      console.error("Error extracting CV preview:", error);
      throw error;
    }
  }, [clearAuthData, router]);

  const updateUserProfile = useCallback(
      async (profileData: UpdateProfileData): Promise<User | void> => {
        try {
          const token = localStorage.getItem("token");

          if (!token) {
            throw new Error("No authentication token found");
          }

          if (isTokenExpired(token)) {
            clearAuthData();
            router.push("/login");
            throw new Error("Session expired. Please login again.");
          }

          const response = await axios.patch(
              `${apiUrl}/auth/update`,
              profileData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
          );

          if (response.data.success && response.data.user) {
            const { user } = response.data;

            const userString = JSON.stringify(user);
            localStorage.setItem("user", userString);
            setCookie("user", userString);

            setState((prevState) => ({
              ...prevState,
              user,
            }));

            return user;
          } else {
            throw new Error(response.data.message || "Error updating profile");
          }
        } catch (error) {
          console.error("Profile update error:", error);
          if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to update profile"
            );
          }
          throw error;
        }
      },
      [clearAuthData, router]
  );

  const logout = useCallback(() => {
    setIsLoggingOut(true);
    clearAuthData();
    router.push("/login");

    setTimeout(() => {
      setIsLoggingOut(false);
    }, 500);
  }, [clearAuthData, router]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 401) {
            clearAuthData();
            router.push("/login");
          }
          return Promise.reject(error);
        }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [clearAuthData, router]);

  return (
      <AuthContext.Provider
          value={{
            ...state,
             signup, 
            login,
            logout,
            updateUserProfile,
            courses,
            certifications,
            skills,
            professionalHistory,
            goalsAndTrajectory,
            notifications,
            uploadCV,
            extractCVPreview,
            isLoggingOut,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}