// test/Login.test.js

// 1) Mocks globales: NEXT APP ROUTER
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

// 2) Mock de useAuth
const mockLogin = jest.fn();
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
    isLoggingOut: false,
  }),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LoginPage', () => {
  test('muestra alerta de error con credenciales inválidas', async () => {
    // Simula un login "fallido"
    mockLogin.mockRejectedValueOnce(new Error('Credenciales inválidas'));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'incorrecto@correo.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Espera a que aparezca el alert inline
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('incorrecto@correo.com', 'wrongpass');

      // Aquí confirmamos que exista un role="alert" con el mensaje esperado
      const alerta = screen.getByRole('alert');
      expect(alerta).toHaveTextContent(/verifica tus credenciales/i);
    });
  });

  test('al hacer login exitoso muestra la pantalla de éxito', async () => {
    // Simula un login "exitoso"
    mockLogin.mockResolvedValueOnce({ success: true });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'usuario@accenture.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Espera a que cambie a la UI de éxito
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('usuario@accenture.com', 'password123');

      // Comprueba que aparezca el título de éxito inline
      expect(screen.getByText(/¡inicio de sesión exitoso!/i)).toBeInTheDocument();
      expect(screen.getByText(/redirigiendo al dashboard/i)).toBeInTheDocument();
    });
  });
});
