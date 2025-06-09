import React, { useState } from 'react';
import { useSignup, SignupFormData, validateSignupData } from '../hooks/useSignUp';
import { User, Users, Mail, Lock, Briefcase, Calendar, Star, Shield, Sparkles } from 'lucide-react';

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
 const getRoleIcon = (role:string) => {
    switch(role) {
      case 'empleado': return <User className="w-5 h-5" />;
      case 'manager': return <Users className="w-5 h-5" />;
      case 'administrador': return <Shield className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'empleado': return 'from-primary-500 to-cyan-500';
      case 'manager': return 'from-primary-500 to-emerald-500';
      case 'administrador': return 'from-primary-500 to-pink-500';
      default: return 'from-primary-500 to-cyan-500';
    }
  };
return (
    <form onSubmit={handleSubmit} className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header with animated title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
              alt="Accenture Logo"
              className="h-20 drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-primary">
            Registro de Usuario
          </h1>
          <p className="text-secondary-600 text-lg">Únete a nuestro equipo y comienza tu aventura profesional</p>
        </div>



        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">
          <div className="space-y-8">
            {/* Error Messages */}
            {allErrors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-r-xl animate-shake">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <ul className="list-disc list-inside space-y-1">
                      {allErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-6 py-4 rounded-r-xl animate-bounce">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">¡Registro exitoso! 🎉 Bienvenido al sistema.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                    Nombre *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Ingresa tu nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300"
                    />
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                    Apellido *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Ingresa tu apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300"
                    />
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300"
                  />
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password_hash"
                    placeholder="Ingresa una contraseña segura"
                    value={formData.password_hash}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300"
                  />
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Step 2: Professional Information */}
            <div className="space-y-6 border-t border-gray-100 pt-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Información Profesional</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors">
                    Fecha de Contratación *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="fecha_contratacion"
                      value={formData.fecha_contratacion}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 hover:border-green-300"
                    />
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors">
                    Antigüedad (años) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="antiguedad"
                      placeholder="0"
                      value={formData.antiguedad}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 hover:border-green-300"
                    />
                    <Star className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors">
                  Puesto Actual *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="puesto_actual"
                    placeholder="Ej: Desarrollador Frontend, Gerente de Ventas"
                    value={formData.puesto_actual}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 hover:border-green-300"
                  />
                  <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors">
                  Historial Profesional *
                </label>
                <textarea
                  name="historial_profesional"
                  placeholder="Describe tu experiencia profesional anterior..."
                  value={formData.historial_profesional}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 hover:border-green-300 resize-none"
                />
              </div>
            </div>

            {/* Step 3: Role Selection */}
            <div className="space-y-6 border-t border-gray-100 pt-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 bg-gradient-to-r ${getRoleColor(formData.rolElegido)} rounded-xl transition-all duration-300`}>
                  {getRoleIcon(formData.rolElegido)}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Rol en el Sistema</h2>
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Tipo de Usuario *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'empleado', label: 'Empleado', icon: User, color: 'blue' },
                    { value: 'manager', label: 'Manager', icon: Users, color: 'green' },
                    { value: 'administrador', label: 'Administrador', icon: Shield, color: 'purple' }
                  ].map((role) => (
                    <label key={role.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="rolElegido"
                        value={role.value}
                        checked={formData.rolElegido === role.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-6 border-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                        formData.rolElegido === role.value
                          ? `border-${role.color}-500 bg-${role.color}-50 shadow-lg`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 bg-gradient-to-r from-${role.color}-500 to-${role.color}-600 rounded-lg`}>
                            <role.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-800">{role.label}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional fields based on role */}
              {formData.rolElegido === 'empleado' && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200 animate-fadeIn">
                  <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Configuración de Empleado
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">Estado</label>
                      <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="BANCA">BANCA</option>
                        <option value="ASIGNADO">Asignado</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">Disponibilidad (%)</label>
                      <input
                        type="number"
                        name="porcentaje_disponibilidad"
                        placeholder="100"
                        value={formData.porcentaje_disponibilidad}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.rolElegido === 'manager' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 animate-fadeIn">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Configuración de Manager
                  </h4>
                  <label className="block text-sm font-medium text-green-700 mb-2">Área de Responsabilidad</label>
                  <input
                    type="text"
                    name="area_responsabilidad"
                    placeholder="Ej: Desarrollo, Ventas, Marketing"
                    value={formData.area_responsabilidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300"
                  />
                </div>
              )}

              {formData.rolElegido === 'administrador' && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 animate-fadeIn">
                  <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Configuración de Administrador
                  </h4>
                  <label className="block text-sm font-medium text-purple-700 mb-2">Departamento</label>
                  <input
                    type="text"
                    name="departamento"
                    placeholder="Ej: Recursos Humanos, TI, Finanzas"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Crear Cuenta
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </form>
  );
}