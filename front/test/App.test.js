// test/App.test.js
import React from 'react'
import { render, screen } from '@testing-library/react'

// 1) Mock del router de Next
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

// 2) Mock de useAuth
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isAuthenticated: false,
    user: null,
    isLoggingOut: false,
  }),
}));

// 3) Mock de useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// 4) Importa tu página de login
import LoginPage from '@/app/login/page'

describe('Carga inicial del componente LoginPage', () => {
  test('muestra el título y campos de login', () => {
    render(<LoginPage />)

    // Ajusta estas aserciones al contenido real
    expect(screen.getByText(/accenture hr/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })
})
