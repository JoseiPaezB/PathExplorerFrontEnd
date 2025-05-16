// jest.setup.js
import '@testing-library/jest-dom'

// Mock global del App Router de Next
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))
