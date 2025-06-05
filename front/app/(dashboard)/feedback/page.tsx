'use client';

import React, { useState, useEffect } from 'react';
import useFeedback from '../../../hooks/useFeedback'; 

interface CreateEvaluacionData {
  id_empleado: number;
  fecha: string;
  areas_mejora: string;
  calificacion: number;
  id_proyecto: number;
  comentarios: string;
  fortalezas: string;
}

export default function FeedbackPage() {
  const {
    evaluaciones,
    teamData, 
    loading,
    error,
    getEvaluacionesManager,
    getEvaluacionesEmpleado,
    getEvaluacionesAdministrador,
    createEvaluacion,
    getTeamAndMembers,
    clearError
  } = useFeedback();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [formData, setFormData] = useState<CreateEvaluacionData>({
    id_empleado: 0,
    fecha: new Date().toISOString().split('T')[0],
    areas_mejora: '',
    calificacion: 1,
    id_proyecto: 0, // We'll use this to filter employees
    comentarios: '',
    fortalezas: ''
  });

  const getUserRole = () => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
      
      if (userCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
          return userData.role || '';
        } catch (error) {
          console.error('Error parsing user cookie:', error);
        }
      }
    }
    return '';
  };

  const loadEvaluaciones = async () => {
    const role = getUserRole();
    setUserRole(role);
    
    try {
      switch (role) {
        case 'manager':
          await getEvaluacionesManager();
          break;
        case 'empleado':
          await getEvaluacionesEmpleado();
          break;
        case 'administrador':
          await getEvaluacionesAdministrador();
          break;
        default:
          console.error('Unknown user role:', role);
      }
    } catch (err) {
      console.error('Error loading evaluaciones:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const role = getUserRole();
        setUserRole(role);
        
        await loadEvaluaciones();
        
        if (role === 'manager') {
          await getTeamAndMembers();
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: name === 'id_empleado' || name === 'calificacion' || name === 'id_proyecto' 
          ? Number(value) 
          : value
      };

      if (name === 'id_proyecto') {
        newFormData.id_empleado = 0; 
      }
      return newFormData;
    });
  };

  const handleSubmit = async () => {
    try {
      if (formData.id_proyecto === 0) {
        alert('Por favor, selecciona un proyecto.');
        return;
      }
      if (formData.id_empleado === 0) {
        alert('Por favor, selecciona un empleado.');
        return;
      }

      await createEvaluacion(formData);
      setShowCreateForm(false);
      setFormData({
        id_empleado: 0,
        fecha: new Date().toISOString().split('T')[0],
        areas_mejora: '',
        calificacion: 0,
        id_proyecto: 0,
        comentarios: '',
        fortalezas: ''
      });
      await loadEvaluaciones();
      alert('Evaluación creada exitosamente');
    } catch (err) {
      console.error('Error creating evaluation:', err);
    }
  };

const getProjectOptions = () => {
    const projects: Array<{ id: number; name: string }> = [];
    const addedProjectIds = new Set<number>();

    teamData.forEach(team => {
        if (team.id_proyecto !== undefined && team.id_proyecto !== null && !isNaN(Number(team.id_proyecto)) && !addedProjectIds.has(Number(team.id_proyecto))) {
            projects.push({
                id: Number(team.id_proyecto), // Now guaranteed to be a number (or safely converted)
                name: team.proyecto
            });
            addedProjectIds.add(Number(team.id_proyecto));
        }
    });
    return projects;
  };

  const getEmployeeOptions = () => {
    const selectedProjectId = formData.id_proyecto;
    const employees: Array<{id: number, name: string}> = [];

    if (selectedProjectId === 0) {
      return [];
    }

    const relevantTeams = teamData.filter(team => team.id_proyecto === selectedProjectId);

    relevantTeams.forEach(team => {
        const integrantes = Array.isArray(team.integrantes) 
            ? team.integrantes 
            : (team.integrantes ? [team.integrantes] : []); 

        integrantes.forEach(member => {
            if (member.id_empleado && member.nombre && !employees.some(emp => emp.id === member.id_empleado)) {
                employees.push({ id: member.id_empleado, name: member.nombre });
            }
        });
    });
    return employees;
  };


  if (loading && evaluaciones.length === 0 && userRole !== 'empleado') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {userRole === 'manager' && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userRole === 'manager' ? 'Gestión de Evaluaciones' : 
              'Administración de Evaluaciones'}
            </h1>
            <p className="text-gray-600">
              {userRole === 'manager' ? 'Administra las evaluaciones de desempeño de tu equipo' : 
              'Gestiona todas las evaluaciones del sistema'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition-colors"
            >
              {showCreateForm ? 'Cancelar' : 'Nueva Evaluación'}
            </button>
            <button
              onClick={getEvaluacionesManager} 
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Crear Nueva Evaluación</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proyecto
                    </label>
                    <select
                      name="id_proyecto"
                      value={formData.id_proyecto}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={0}>Seleccionar proyecto</option>
                      {getProjectOptions().map(proj => (
                        <option key={proj.id} value={proj.id}>{proj.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empleado
                    </label>
                    <select
                      name="id_empleado"
                      value={formData.id_empleado}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={formData.id_proyecto === 0} // Disable until a project is selected
                    >
                      <option value={0}>
                        {formData.id_proyecto === 0 ? 'Selecciona un proyecto primero' : 'Seleccionar empleado'}
                      </option>
                      {getEmployeeOptions().map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calificación (1-10)
                    </label>
                    <input
                      type="number"
                      name="calificacion"
                      value={formData.calificacion}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      step="1"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fortalezas
                  </label>
                  <textarea
                    name="fortalezas"
                    value={formData.fortalezas}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe las fortalezas del empleado..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Áreas de Mejora
                  </label>
                  <textarea
                    name="areas_mejora"
                    value={formData.areas_mejora}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe las áreas que necesitan mejora..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentarios Adicionales
                  </label>
                  <textarea
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Comentarios adicionales sobre el desempeño..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creando...' : 'Crear Evaluación'}
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team and Projects Overview */}
          
        </>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {userRole === 'empleado' ? 'Mis Evaluaciones de Desempeño' : 'Evaluaciones Existentes'}
        </h2>
        {evaluaciones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {userRole === 'empleado' ? (
              <div>
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd"></path>
                </svg>
                <p className="text-lg font-medium text-gray-600 mb-2">No tienes evaluaciones disponibles</p>
                <p className="text-sm text-gray-500">Tus evaluaciones de desempeño aparecerán aquí cuando tu manager las complete</p>
              </div>
            ) : (
              <p>No hay evaluaciones disponibles</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {evaluaciones.map((evaluacion) => (
              <div key={evaluacion.id_evaluacion} className={`border rounded-lg p-6 shadow-sm ${
                userRole === 'empleado' ? 'bg-blue-50 border-blue-200' : 'bg-white'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Evaluación #{evaluacion.id_evaluacion}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Proyecto: {evaluacion.proyecto_nombre || evaluacion.proyecto}
                    </p>
                    <p className="text-sm text-gray-600">
                      Fecha: {new Date(evaluacion.fecha).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      evaluacion.calificacion >= 8 ? 'text-primary-600' : 
                      evaluacion.calificacion >= 6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {evaluacion.calificacion}/10
                    </div>
                    {userRole === 'empleado' && (
                      <p className="text-xs text-gray-500 mt-1">Tu calificación</p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">
                      {userRole === 'empleado' ? 'Tus Fortalezas:' : 'Fortalezas:'}
                    </h4>
                    <p className="text-sm text-gray-700">{evaluacion.fortalezas}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">
                      {userRole === 'empleado' ? 'Áreas de Oportunidad:' : 'Áreas de Mejora:'}
                    </h4>
                    <p className="text-sm text-gray-700">{evaluacion.areas_mejora}</p>
                  </div>
                </div>
                
                {evaluacion.comentarios && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      {userRole === 'empleado' ? 'Comentarios de tu Manager:' : 'Comentarios:'}
                    </h4>
                    <p className="text-sm text-gray-700">{evaluacion.comentarios}</p>
                  </div>
                )}

                {userRole === 'empleado' && (
                  <div className="mt-4 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                      </svg>
                      Esta evaluación es de solo lectura
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}