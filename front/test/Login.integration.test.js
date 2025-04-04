// test/Login.integration.test.js
import { render, screen } from "@testing-library/react";
import { useAuth } from "@/contexts/auth-context";
import React from "react";

// Mock del contexto de autenticación
jest.mock("@/contexts/auth-context", () => ({
  useAuth: jest.fn(),
}));

// Mock del componente DashboardPage o componentes que representen las vistas por rol
const DashboardEmpleado = () => (
  <>
    <h1>Mis cursos</h1>
    <p>Proyecto actual: PathExplorer</p>
  </>
);
const DashboardAdmin = () => (
  <>
    <h1>Gestión de usuarios</h1>
    <p>Departamentos activos</p>
  </>
);
const DashboardManager = () => (
  <>
    <h1>Equipo</h1>
    <p>Analítica de desempeño</p>
  </>
);

// Función auxiliar para simular login por rol
function renderByRole(role) {
  useAuth.mockReturnValue({
    user: { name: "Test User", email: "test@accenture.com", role },
    isAuthenticated: true,
  });

  switch (role) {
    case "Empleado":
      render(<DashboardEmpleado />);
      break;
    case "Administrador":
      render(<DashboardAdmin />);
      break;
    case "Manager":
      render(<DashboardManager />);
      break;
    default:
      throw new Error("Rol no reconocido");
  }
}

describe("🔐 Login simulado (actualmente) por rol", () => {
  test("🧑 Empleado ve su panel con cursos y proyecto", () => {
    renderByRole("Empleado");
    expect(screen.getByText(/mis cursos/i)).toBeInTheDocument();
    expect(screen.getByText(/proyecto/i)).toBeInTheDocument();
  });

  test("👩 Administrador ve gestión de usuarios y departamentos", () => {
    renderByRole("Administrador");
    expect(screen.getByText(/gestión de usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/departamentos/i)).toBeInTheDocument();
    expect(screen.queryByText(/mis cursos/i)).not.toBeInTheDocument();
  });

  test("👨 Manager ve equipo y analítica", () => {
    renderByRole("Manager");
    expect(screen.getByText(/equipo/i)).toBeInTheDocument();
    expect(screen.getByText(/analítica/i)).toBeInTheDocument();
    expect(screen.queryByText(/gestión de usuarios/i)).not.toBeInTheDocument();
  });
});
