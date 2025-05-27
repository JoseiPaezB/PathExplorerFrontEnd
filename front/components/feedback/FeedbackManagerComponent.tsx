import React, { useState, useEffect } from 'react';
import useFeedback from '../../hooks/useFeedback'; // Adjust path as needed

interface CreateEvaluacionData {
  id_empleado: number;
  fecha: string;
  areas_mejora: string;
  calificacion: number;
  id_proyecto: number;
  comentarios: string;
  fortalezas: string;
}

const FeedbackManager: React.FC = () => {
  const {
    evaluaciones,
    teamData,
    loading,
    error,
    getEvaluacionesManager,
    createEvaluacion,
    getTeamAndMembers,
    clearError
  } = useFeedback();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateEvaluacionData>({
    id_empleado: 0,
    fecha: new Date().toISOString().split('T')[0],
    areas_mejora: '',
    calificacion: 0,
    id_proyecto: 0,
    comentarios: '',
    fortalezas: ''
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getEvaluacionesManager(),
          getTeamAndMembers()
        ]);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    loadData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_empleado' || name === 'calificacion' || name === 'id_proyecto' 
        ? Number(value) 
        : value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
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
      // Refresh evaluaciones
      await getEvaluacionesManager();
      alert('Evaluación creada exitosamente');
    } catch (err) {
      console.error('Error creating evaluation:', err);
    }
  };

  // Get unique employees from team data
  const getEmployeeOptions = () => {
    const employees: Array<{id: number, name: string}> = [];
    teamData.forEach(team => {
      if (Array.isArray(team.integrantes)) {
        team.integrantes.forEach(member => {
          if (!employees.find(emp => emp.id === member.id_empleado)) {
            employees.push({ id: member.id_empleado, name: member.nombre });
          }
        });
      } else if (team.integrantes && team.integrantes.id_empleado) {
        if (!employees.find(emp => emp.id === team.integrantes.id_empleado)) {
          employees.push({ 
            id: team.integrantes.id_empleado, 
            name: team.integrantes.nombre 
          });
        }
      }
    });
    return employees;
  };

  // Get unique projects
  const getProjectOptions = () => {
    return teamData.map((team, index) => ({
      id: index + 1, // You might want to adjust this based on your actual project IDs
      name: team.proyecto
    }));
  };

  if (loading && evaluaciones.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Evaluaciones</h1>
        <p className="text-gray-600">Administra las evaluaciones de desempeño de tu equipo</p>
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

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
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

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Evaluación</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                >
                  <option value={0}>Seleccionar empleado</option>
                  {getEmployeeOptions().map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

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
                  Calificación (0-10)
                </label>
                <input
                  type="number"
                  name="calificacion"
                  value={formData.calificacion}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.1"
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

      {/* Evaluations List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Evaluaciones Existentes</h2>
        {evaluaciones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay evaluaciones disponibles</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {evaluaciones.map((evaluacion) => (
              <div key={evaluacion.id_evaluacion} className="border rounded-lg p-6 bg-white shadow-sm">
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
                    <div className="text-2xl font-bold text-blue-600">
                      {evaluacion.calificacion}/10
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Fortalezas:</h4>
                    <p className="text-sm text-gray-700">{evaluacion.fortalezas}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">Áreas de Mejora:</h4>
                    <p className="text-sm text-gray-700">{evaluacion.areas_mejora}</p>
                  </div>
                </div>
                
                {evaluacion.comentarios && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Comentarios:</h4>
                    <p className="text-sm text-gray-700">{evaluacion.comentarios}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManager;