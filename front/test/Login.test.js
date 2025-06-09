// 🚨 Mocks globales (router, auth, toast)
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockLogin = jest.fn()
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
    isLoggingOut: false,
  }),
}))

const mockToast = jest.fn()
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

import React from 'react'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/app/login/page'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('LoginPage – comportamiento de UI completo', () => {
  test('botón “Iniciar sesión” arranca habilitado', () => {
    render(<LoginPage />)
    const btn = screen.getByRole('button', { name: /iniciar sesión/i })
    expect(btn).toBeEnabled()
  })

  test('deshabilita el botón mientras se realiza el login', async () => {
    let resolveLogin
    mockLogin.mockReturnValueOnce(
      new Promise(res => {
        resolveLogin = res
      })
    )

    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'foo@bar.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: '123456' },
    })

    const btn = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(btn)
    expect(btn).toBeDisabled()

    await act(async () => {
      resolveLogin()  // liberamos la promesa
    })
  })

  test('muestra alerta de error si login rechaza', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Credenciales inválidas'))

    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'invalid@correo.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    const alerta = await screen.findByRole('alert')
    expect(alerta).toHaveTextContent(/verifica tus credenciales/i)
    expect(mockLogin).toHaveBeenCalledWith('invalid@correo.com', 'wrongpass')
  })

  test('muestra pantalla de éxito tras login exitoso', async () => {
    mockLogin.mockResolvedValueOnce(undefined)

    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'user@accenture.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    const titulo = await screen.findByText(/¡inicio de sesión exitoso!/i)
    expect(titulo).toBeInTheDocument()
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Inicio de sesión exitoso',
      description: 'Bienvenido al Sistema de Gestión de Talentos',
    })
  })

  test('redirige al dashboard después de un login exitoso', async () => {
    jest.useFakeTimers()
    mockLogin.mockResolvedValueOnce(undefined)

    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'user@accenture.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => expect(mockLogin).toHaveBeenCalled())
    await act(async () => {
      jest.advanceTimersByTime(1200)
    })
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
    jest.useRealTimers()
  })
})
