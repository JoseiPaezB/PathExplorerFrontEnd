'use client';

import { useState } from 'react';

// Types
interface Evaluacion {
  id_evaluacion: number;
  id_empleado: number;
  id_manager: number;
  fecha: string;
  areas_mejora: string;
  calificacion: number;
  id_proyecto: number;
  comentarios: string;
  fortalezas: string;
  proyecto_nombre?: string;
  proyecto?: string;
}

interface TeamMember {
  id_empleado: number;
  nombre: string;
}

interface ProjectTeam {
  proyecto: string;
  id_proyecto: number; // Make this REQUIRED if your backend will always provide it now
  integrantes: TeamMember | TeamMember[];
}

interface CreateEvaluacionData {
  id_empleado: number;
  fecha: string;
  areas_mejora: string;
  calificacion: number;
  id_proyecto: number;
  comentarios: string;
  fortalezas: string;
}

interface EvaluacionesResponse {
  hasEvaluaciones: boolean;
  evaluaciones: Evaluacion[];
}

interface TeamResponse {
  equipos: ProjectTeam[];
}

const useFeedback = () => {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [teamData, setTeamData] = useState<ProjectTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  };

  // Base fetch function with auth headers
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    
    // Add the base URL to your API endpoints
    const baseURL = 'http://localhost:4000';
    const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`;
    
    const response = await fetch(fullURL, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Get evaluaciones for manager
  const getEvaluacionesManager = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: EvaluacionesResponse = await fetchWithAuth('/api/feedback/manager');
      setEvaluaciones(data.evaluaciones);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching manager evaluaciones');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get evaluaciones for empleado
  const getEvaluacionesEmpleado = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: EvaluacionesResponse = await fetchWithAuth('/api/feedback/empleado');
      setEvaluaciones(data.evaluaciones);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching empleado evaluaciones');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get evaluaciones for administrador
  const getEvaluacionesAdministrador = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: EvaluacionesResponse = await fetchWithAuth('/api/feedback/administrador');
      setEvaluaciones(data.evaluaciones);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching admin evaluaciones');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new evaluacion
  const createEvaluacion = async (evaluacionData: CreateEvaluacionData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/api/feedback/create', {
        method: 'POST',
        body: JSON.stringify(evaluacionData),
      });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating evaluacion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get team and projects data
  const getTeamAndMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: TeamResponse = await fetchWithAuth('/api/feedback/team-and-members');
      setTeamData(data.equipos);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching team data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  return {
    // State
    evaluaciones,
    teamData,
    loading,
    error,
    
    // Actions
    getEvaluacionesManager,
    getEvaluacionesEmpleado,
    getEvaluacionesAdministrador,
    createEvaluacion,
    getTeamAndMembers,
    clearError,
    
    // Setters for manual state updates
    setEvaluaciones,
    setTeamData,
  };
};

// IMPORTANT: Make sure to export as default
export default useFeedback;