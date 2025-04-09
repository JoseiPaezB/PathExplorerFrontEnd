// middleware.ts
// This file should be placed in the root of your project

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which roles can access which routes
const routePermissions: Record<string, string[]> = {
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

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/unauthorized", "/test-auth"];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Always allow access to the unauthorized page itself
  if (path === '/unauthorized') {
    return NextResponse.next();
  }
  
  // If it's a public route, allow access
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }
  
  // Check for auth token and user data in cookies
  const userDataCookie = request.cookies.get('user')?.value;
  const token = request.cookies.get('token')?.value;
  
  // If no token or user data, redirect to login
  if (!token || !userDataCookie) {
    console.log('No auth token or user data found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Try to parse user data from cookie
  try {
    const userData = JSON.parse(decodeURIComponent(userDataCookie));
    const userRole = userData.role || 'empleado';
    
    console.log('User role from cookie:', userRole);
    console.log('Attempting to access path:', path);
    
    // Check if path requires authorization
    const allowedRoles = routePermissions[path];
    
    if (!allowedRoles) {
      // Path not found in permissions map, allow access (will likely 404)
      return NextResponse.next();
    }
    
    // Check if user's role is allowed to access this path
    if (!allowedRoles.includes(userRole)) {
      console.log(`Access denied: ${userRole} cannot access ${path}`);
      
      // Redirect to unauthorized page with the attempted path as query parameter
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // User has permission, allow access
    console.log('Access granted');
    return NextResponse.next();
  } catch (error) {
    // Error parsing user data, redirect to login
    console.error('Error parsing user data:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};