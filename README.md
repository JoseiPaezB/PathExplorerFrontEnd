# PathExplorer Frontend
Una aplicación web moderna desarrollada con Next.js para Path Explorer, proporcionando una interfaz de usuario intuitiva y responsiva para la gestión de talentos y proyectos en Accenture.

## Tecnologías Utilizadas
- **Frontend**: Next.js 15, React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **Testing**: Playwright, Testing Library
- **Animaciones**: Framer Motion
- **Autenticación**: JWT con contexto React
- **Gráficos**: Chart.js, Recharts
- **Exportación**: jsPDF, XLSX

## Requisitos Previos
- Node.js >= 18.0.0
- npm o yarn
- PathExplorer Backend ejecutándose en puerto 4000

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/GustavoCoutino/PathExplorerFrontend.git
   cd PathExplorerFrontend
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   Edita el archivo `.env.local` con tus configuraciones:
   ```env
   # API Backend
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   
   # Variables de testing (opcional)
   PASSWORD=tu_password_test
   EMPLOYEE_EMAIL=empleado@test.com
   MANAGER_EMAIL=manager@test.com
   ADMIN_EMAIL=admin@test.com
   ```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint

# Testing unitario con Jest
npm test

# Testing E2E con Playwright
npm run test-e2e
```

## Testing

### Testing Unitario (Jest)
```bash
# Ejecutar todos los tests unitarios
npm test

# Tests en modo watch
npm run test:watch
```

### Testing E2E (Playwright)
```bash
# Ejecutar tests end-to-end
npm run test-e2e

# Instalar navegadores de Playwright
npx playwright install

# Ejecutar tests con UI
npx playwright test --ui
```

## Características Principales

### 🎯 **Gestión de Usuarios y Roles**
- Autenticación JWT con múltiples roles (Admin, Manager, Empleado)
- Dashboard personalizado según el rol
- Gestión de perfiles y configuración

### 📊 **Analítica y Reportes**
- Gráficos interactivos con Chart.js y Recharts
- Exportación a PDF, Excel y CSV
- Métricas de desempeño y progreso

### 🎓 **Desarrollo Profesional**
- Gestión de cursos y certificaciones
- Trayectorias profesionales personalizadas
- Sistema de recomendaciones con IA

### 🚀 **Gestión de Proyectos**
- Vista Kanban para roles y asignaciones
- Matching automático empleado-proyecto
- Sistema de solicitudes y autorizaciones

### 📱 **Interfaz Moderna**
- Diseño responsivo con Tailwind CSS
- Componentes accesibles con Radix UI
- Animaciones fluidas con Framer Motion

## Autenticación y Roles

La aplicación maneja tres tipos de usuarios:

- **Administrador**: Acceso completo, gestión de usuarios y reportes
- **Manager**: Gestión de proyectos, evaluaciones y equipos  
- **Empleado**: Perfil personal, cursos, trayectoria y proyecto actual
