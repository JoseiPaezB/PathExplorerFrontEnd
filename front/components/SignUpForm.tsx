import React, { useState } from 'react';
import { useSignup, SignupFormData, validateSignupData } from '../hooks/useSignUp';

interface SignupFormProps {
  apiBaseUrl?: string;
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  className?: string;
  customSignup?:(FormData: SignupFormData) => Promise<any>; 

}

export const SignupForm: React.FC<SignupFormProps> = ({
  apiBaseUrl = '/api',
  onSuccess,
  onError,
  className = '',
  customSignup,
}) => {
  const { signup, isLoading, error, success, clearError } = useSignup(apiBaseUrl);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<SignupFormData>({
    nombre: '',
    apellido: '',
    email: '',
    password_hash: '',
    fecha_contratacion: '',
    puesto_actual: '',
    antiguedad: 0,
    historial_profesional: '',
    estado: 'BANCA',
    porcentaje_disponibilidad: 100,
    area_responsabilidad: '',
    departamento: '',
    rolElegido: 'empleado',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    
    setFormData((prev: SignupFormData) => ({
      ...prev,
      [name]: name === 'antiguedad' || name === 'porcentaje_disponibilidad' 
        ? Number(value) 
        : value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  clearError();
  setValidationErrors([]);

  const errors = validateSignupData(formData);
  if (errors.length > 0) {
    setValidationErrors(errors);
    return;
  }

  // Use custom signup function if provided, otherwise use the hook
  if (customSignup) {
    try {
      const result = await customSignup(formData);
      if (result.success) {
        onSuccess?.(result.user);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
    }
  } else {
    // Original signup logic with the hook
    const result = await signup(formData);
    if (result.success && result.user) {
      onSuccess?.(result.user);
    } else if (!result.success) {
      onError?.(result.message);
    }
  }
};

  const allErrors = [...validationErrors, ...(error ? [error] : [])];

  return (
    <div className={`max-w-2xl mx-auto p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">Registro de Usuario</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Messages */}
        {allErrors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <ul className="list-disc list-inside">
              {allErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ¡Registro exitoso! Bienvenido al sistema.
          </div>
        )}

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Información Personal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ingresa tu nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                placeholder="Ingresa tu apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              name="password_hash"
              placeholder="Ingresa una contraseña segura"
              value={formData.password_hash}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Información Profesional</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Contratación *
              </label>
              <input
                type="date"
                name="fecha_contratacion"
                value={formData.fecha_contratacion}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Antigüedad (años) *
              </label>
              <input
                type="number"
                name="antiguedad"
                placeholder="0"
                value={formData.antiguedad}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puesto Actual *
            </label>
            <input
              type="text"
              name="puesto_actual"
              placeholder="Ej: Desarrollador Frontend, Gerente de Ventas"
              value={formData.puesto_actual}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Historial Profesional *
            </label>
            <textarea
              name="historial_profesional"
              placeholder="Describe tu experiencia profesional anterior..."
              value={formData.historial_profesional}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Rol en el Sistema</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Usuario *
            </label>
            <select
              name="rolElegido"
              value={formData.rolElegido}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="empleado">Empleado</option>
              <option value="manager">Manager</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          {/* Conditional fields based on role */}
          {formData.rolElegido === 'empleado' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BANCA">BANCA</option>
                  <option value="ASIGNADO">Asignado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponibilidad (%)
                </label>
                <input
                  type="number"
                  name="porcentaje_disponibilidad"
                  placeholder="100"
                  value={formData.porcentaje_disponibilidad}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {formData.rolElegido === 'manager' && (
            <div className="p-4 bg-green-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área de Responsabilidad
              </label>
              <input
                type="text"
                name="area_responsabilidad"
                placeholder="Ej: Desarrollo, Ventas, Marketing"
                value={formData.area_responsabilidad}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {formData.rolElegido === 'administrador' && (
            <div className="p-4 bg-red-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                name="departamento"
                placeholder="Ej: Recursos Humanos, TI, Finanzas"
                value={formData.departamento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando...
            </span>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>
    </div>
  );
};