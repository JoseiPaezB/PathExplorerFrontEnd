// contexts/auth-context.tsx
"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { AuthState, User, LoginResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User | void>;
  logout: () => void;
  updateUserProfile: (profileData: UpdateProfileData) => Promise<User | void>;
  isLoggingOut: boolean;
}

interface UpdateProfileData {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
}

interface JwtPayload {
  id_persona: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
          `${API_URL}/auth/login`,
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
          `${API_URL}/auth/update`,
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
