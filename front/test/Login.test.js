import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/app/login/page';

// ✅ MOCKS
const mockLogin = jest.fn();

// 🧠 Mock del contexto de autenticación
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
    isLoggingOut: false,
  }),
}));

// Mock de router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock del sistema de notificaciones
const mockToast = jest.fn();
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// PRUEBA 1: Login exitoso
test('login exitoso con credenciales válidas', async () => {
  mockLogin.mockResolvedValueOnce({}); // Simula login exitoso

  render(<Login />);

  fireEvent.change(screen.getByLabelText(/correo/i), {
    target: { value: 'usuario@accenture.com' },
  });

  fireEvent.change(screen.getByLabelText(/contraseña/i), {
    target: { value: 'password123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith('usuario@accenture.com', 'password123');
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringMatching(/inicio de sesión/i),
        description: expect.any(String),
      })
    );
  });
});

// PRUEBA 2: Login fallido
test('muestra error con credenciales inválidas', async () => {
  mockLogin.mockImplementationOnce(() => {
    throw new Error('Credenciales inválidas');
  });

  render(<Login />);

  fireEvent.change(screen.getByLabelText(/correo/i), {
    target: { value: 'incorrecto@correo.com' },
  });

  fireEvent.change(screen.getByLabelText(/contraseña/i), {
    target: { value: 'wrongpass' },
  });

  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith('incorrecto@correo.com', 'wrongpass');
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringMatching(/error de inicio/i),
        description: expect.stringMatching(/verifica tus credenciales/i),
      })
    );
  });
});

// PRUEBA 3: Carga inicial de campos
test('renderiza campos de correo y contraseña', () => {
  render(<Login />);

  expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
});
