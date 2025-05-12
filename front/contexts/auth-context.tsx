"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { AuthState, User, LoginResponse, JwtPayload } from "@/types/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type {
  CoursesUserResponse,
  UpdateProfileData,
  CertificationsUserResponse,
  SkillsResponse,
  ProfessionalHistory,
  UserTrajectoryResponse,
} from "@/types/users";
import type { NotificationResponse } from "@/types/notificaciones";
import { apiUrl } from "@/constants";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User | void>;
  logout: () => void;
  updateUserProfile: (profileData: UpdateProfileData) => Promise<User | void>;
  courses: () => Promise<CoursesUserResponse | void>;
  certifications: () => Promise<CertificationsUserResponse | void>;
  professionalHistory: () => Promise<ProfessionalHistory | null>;
  skills: () => Promise<SkillsResponse | null>;
  goalsAndTrajectory: () => Promise<UserTrajectoryResponse | null>;
  notifications: () => Promise<NotificationResponse | null>;
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
  }, []);

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
    }, []);

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
    }, []);

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
  }, []);

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
    }, []);

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
    }, []);

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
        login,
        logout,
        updateUserProfile,
        courses,
        certifications,
        skills,
        professionalHistory,
        goalsAndTrajectory,
        notifications,
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
