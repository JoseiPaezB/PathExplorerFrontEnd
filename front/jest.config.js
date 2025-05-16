// jest.config.js
/** @type {import('jest').Config} */
module.exports = {
  // Directorio raíz de tu proyecto
  rootDir: '.',

  // Simula el navegador
  testEnvironment: 'jsdom',

  // Dónde buscar tests
  testMatch: ['**/test/**/*.(test|spec).(js|jsx|ts|tsx)'],

  // Extensiones que maneja
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Ignorar estas carpetas
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

  // Transformaciones con SWC para TS/JSX
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },

  // Alias y mocks de estilos
  moduleNameMapper: {
    // Al importar con "@/..."
    '^@/(.*)$': '<rootDir>/$1',
    // Mock para imports .css/.scss
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },

  // Scripts que se ejecutan antes de cada test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
