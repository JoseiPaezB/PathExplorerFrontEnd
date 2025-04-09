"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

// Export route permissions so they can be used elsewhere
export const routePermissions: Record<string, string[]> = {
  // Base routes (accessible by all roles)
  "/dashboard": ["empleado", "manager", "administrador"],
  "/perfil": ["empleado", "manager", "administrador"],
  "/configuracion": ["empleado", "manager", "administrador"],
  
  // Employee specific routes
  "/proyecto-actual": ["empleado"],
  "/cursos": ["empleado"],
  "/mi-desempeno": ["empleado"],
  
  // Manager specific routes
  "/proyectos": ["manager"],
  "/equipo": ["manager"],
  "/analitica": ["manager", "empleado"],
  
  // Admin specific routes
  "/usuarios": ["administrador"],
  "/autorizaciones": ["administrador"],
  "/departamentos": ["administrador"],
};

// Export public routes as well
export const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/unauthorized", "/test-auth"];

// Loading component to show when auth is being checked
function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
      <p className="ml-3 text-gray-600">Cargando...</p>
    </div>
  );
}

// Function to handle hard redirects
const forceRedirect = (path: string) => {
  window.location.href = path; // This causes a full page refresh
};

export function withRouteProtection<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [shouldRender, setShouldRender] = useState(false);
    
    useEffect(() => {
      // Wait until auth is no longer loading
      if (isLoading) {
        setShouldRender(false);
        return;
      }
      
      // Debug information
      console.log("🔒 Route Protection Check:");
      console.log("Path:", pathname);
      console.log("Authenticated:", isAuthenticated);
      console.log("User:", user);
      
      // Check if it's a public route
      if (pathname && publicRoutes.includes(pathname)) {
        console.log("✅ Public route - access allowed");
        setShouldRender(true);
        return;
      }
      
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        console.log("❌ Not authenticated - redirecting to login");
        forceRedirect("/login");
        return;
      }
      
      // Check if the path exists and user has required role
      if (!pathname) {
        console.log("⚠️ Pathname is undefined");
        setShouldRender(false);
        return;
      }
      
      const userRole = user.role || "empleado";
      console.log("User role:", userRole);
      
      const allowedRoles = routePermissions[pathname];
      console.log("Allowed roles for this path:", allowedRoles);
      
      if (!allowedRoles) {
        console.log("⚠️ Path not found in route permissions");
        setShouldRender(true); // Let the app handle 404s
        return;
      }
      
      if (!allowedRoles.includes(userRole)) {
        console.log(`🚫 Access denied: ${userRole} cannot access ${pathname}`);
        console.log("Redirecting to unauthorized page...");
        forceRedirect("/unauthorized");
        return;
      }
      
      console.log("✅ Access granted - rendering component");
      setShouldRender(true);
    }, [pathname, user, isAuthenticated, isLoading, router]);
    
    // Show loading indicator if we're still checking auth
    if (isLoading || !shouldRender) {
      return <LoadingIndicator />;
    }
    
    // Render the component only if we've determined it should be rendered
    return <Component {...props} />;
  };
}