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

// Update AuthContextType to include isLoading
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User | void>;
  logout: () => void;
  updateUserProfile: (profileData: UpdateProfileData) => Promise<User | void>;
  isLoggingOut: boolean;
  isLoading: boolean;
}

interface UpdateProfileData {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
}

// Update default context value to include isLoading
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Set cookie with HttpOnly option for better security
const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
  
  // For debugging
  console.log(`Cookie set: ${name}`);
};

const deleteCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  console.log(`Cookie deleted: ${name}`);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setState({
            user: parsedUser,
            isAuthenticated: true,
          });

          // Make sure cookies are set for middleware to work
          setCookie("user", storedUser);
          setCookie("token", token);
          
          console.log("User authenticated from storage:", parsedUser.role);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          deleteCookie("user");
          deleteCookie("token");
        }
      }
      setIsLoading(false);
    };

    init();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<User | void> => {
      setIsLoading(true);
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

          const userString = JSON.stringify(user);

          // Store in localStorage for persistence
          localStorage.setItem("token", token);
          localStorage.setItem("user", userString);
          
          // Set cookies for middleware access
          setCookie("token", token);
          setCookie("user", userString);

          setState({
            user,
            isAuthenticated: true,
          });
          
          console.log("User logged in:", user.role);

          return user;
        } else {
          throw new Error(response.data.message || "Credenciales inválidas");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error("Autenticación fallida");
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateUserProfile = useCallback(
    async (profileData: UpdateProfileData): Promise<User | void> => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
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
          
          // Update localStorage
          localStorage.setItem("user", userString);
          
          // Update cookies
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
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setIsLoggingOut(true);
    setIsLoading(true);

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear cookies
    deleteCookie("user");
    deleteCookie("token");

    setState({ user: null, isAuthenticated: false });

    // Use hard redirect for logout to ensure all state is cleared
    window.location.href = "/login";
    
    setTimeout(() => {
      setIsLoggingOut(false);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    console.log("Auth state updated:", state.isAuthenticated);
    if (state.user) {
      console.log("User role:", state.user.role);
    }
  }, [state]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUserProfile,
        isLoggingOut,
        isLoading,
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