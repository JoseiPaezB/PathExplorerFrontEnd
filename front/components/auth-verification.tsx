"use client";

// components/AuthVerification.tsx
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

// Routes that require specific roles
const roleRoutes = {
  empleado: ['/proyecto-actual', '/cursos', '/mi-desempeno', '/analitica'],
  manager: ['/proyectos', '/equipo', '/analitica'],
  administrador: ['/usuarios', '/autorizaciones', '/departamentos'],
};

// Routes accessible by all authenticated users
const commonRoutes = ['/dashboard', '/perfil', '/configuracion'];

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/unauthorized', '/test-auth'];

export function AuthVerification({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Double-check permissions on client-side
  useEffect(() => {
    if (isLoading) return;

    // Allow public routes
    if (pathname && publicRoutes.includes(pathname)) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      console.log("Not authenticated, redirecting to login");
      window.location.href = '/login';
      return;
    }

    // If it's a common route that all users can access
    if (pathname && commonRoutes.includes(pathname)) return;

    // Check if the user has the required role for the route
    const userRole = user.role || 'empleado';
    const userAllowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
    
    // If current path is not in user's allowed routes, redirect to unauthorized
    if (pathname && !userAllowedRoutes.includes(pathname)) {
      console.log(`Client-side verification: ${userRole} cannot access ${pathname}`);
      window.location.href = '/unauthorized';
    }
  }, [pathname, isAuthenticated, isLoading, user, router]);

  return <>{children}</>;
}

export default AuthVerification;