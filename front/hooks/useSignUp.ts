import { useState } from 'react';

// Types
export interface SignupFormData {
  nombre: string;
  apellido: string;
  email: string;
  password_hash: string;
  fecha_contratacion: string;
  puesto_actual: string;
  antiguedad: number;
  historial_profesional: string;
  estado?: string;
  porcentaje_disponibilidad?: number;
  area_responsabilidad?: string;
  departamento?: string;
  rolElegido: 'administrador' | 'empleado' | 'manager';
}

interface UserProfile {
  id_persona: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_contratacion: string;
  role: string;
  roleData: any;
  profile: any;
}

interface SignupResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserProfile;
}

interface UseSignupReturn {
  signup: (formData: SignupFormData) => Promise<SignupResponse>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  clearError: () => void;
  clearSuccess: () => void;
}

// Custom hook
export const useSignup = (apiBaseUrl: string = '/api'): UseSignupReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const signup = async (formData: SignupFormData): Promise<SignupResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${apiBaseUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: SignupResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      if (data.success) {
        setSuccess(true);
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Store user data if provided
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(false);

  return {
    signup,
    isLoading,
    error,
    success,
    clearError,
    clearSuccess,
  };
};

// Helper function to validate form data
export const validateSignupData = (formData: SignupFormData): string[] => {
  const errors: string[] = [];

  if (!formData.nombre.trim()) errors.push('El nombre es requerido');
  if (!formData.apellido.trim()) errors.push('El apellido es requerido');
  if (!formData.email.trim()) errors.push('El email es requerido');
  if (!formData.password_hash.trim()) errors.push('La contraseña es requerida');
  if (!formData.fecha_contratacion) errors.push('La fecha de contratación es requerida');
  if (!formData.puesto_actual.trim()) errors.push('El puesto actual es requerido');
  if (formData.antiguedad < 0) errors.push('La antigüedad debe ser mayor a 0');
  if (!formData.historial_profesional.trim()) errors.push('El historial profesional es requerido');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    errors.push('El formato del email no es válido');
  }

  return errors;
};