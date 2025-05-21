import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ENABLE_MIDDLEWARE = true;

export function middleware(request: NextRequest) {
  console.log(
    "Middleware ejecutándose para la ruta:",
    request.nextUrl.pathname
  );

  if (process.env.NODE_ENV === "development" && !ENABLE_MIDDLEWARE) {
    return NextResponse.next();
  }

  const user = request.cookies.get("user")?.value;
  const path = request.nextUrl.pathname;

  if (path === "/restricted-access") {
    return NextResponse.next();
  }

  if (path === "/login" || path === "/recuperar-password") {
    if (user) {
      console.log(
        "Usuario autenticado intentando acceder a /login, redirigiendo según rol"
      );
      try {
        const userData = user ? JSON.parse(user) : null;
        const role = userData?.role;
        
        if (role === "administrador") {
          return NextResponse.redirect(new URL("/usuarios", request.url));
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (error) {
        console.error("Error al analizar datos de usuario:", error);
        // Si hay error, redirigir a dashboard por defecto
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Handle root path (/) based on user role
  if (path === "/") {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    try {
      const userData = user ? JSON.parse(user) : null;
      const role = userData?.role;
      
      if (role === "administrador") {
        return NextResponse.redirect(new URL("/usuarios", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Error al analizar datos de usuario:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!user) {
    console.log(
      "Usuario no autenticado intentando acceder a ruta protegida, redirigiendo a /login"
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const userData = user ? JSON.parse(user) : null;
    const role = userData?.role;

    const commonRoutes = [
      "/perfil",
      "/configuracion",
      "/notificaciones",
    ];
    if (commonRoutes.some((route) => path === route)) {
      return NextResponse.next();
    }

    if (path.match(/^\/usuarios\/\d+\/ver-perfil$/)) {
      return NextResponse.next();
    }

    if (path.match(/^\/usuarios\/\d+\/ver-estado$/)) {
      return NextResponse.next();
    }

    // IMPORTANT: Changed this section to send admins to restricted-access for dashboard
   if (role === "administrador" && (path === "/dashboard" || path.startsWith("/dashboard/"))) {
      console.log("Administrador intentando acceder al dashboard, redirigiendo a restricted-access");
      return NextResponse.redirect(new URL("/restricted-access", request.url));
    }

    if (role === "administrador") {
      const adminRoutes = [
         "/usuarios",
        "/autorizaciones",
        "/departamentos",
        "/informes",
        "/perfil", // Added perfil explicitly to admin routes
        "/configuracion",
        "/notificaciones"
      ];
      if (adminRoutes.some((route) => path === route)) {
        return NextResponse.next();
      }
        // Check for dynamic admin routes with patterns
      const adminPatterns = [
        /^\/usuarios\/\d+\/ver-perfil$/,
        /^\/usuarios\/\d+\/ver-estado$/,
        /^\/usuarios\/.+/,
        /^\/informes\/.+/,
        /^\/autorizaciones\/.+/,
        /^\/departamentos\/.+/
      ];
      
      if (adminPatterns.some(pattern => pattern.test(path))) {
        console.log("Admin accessing allowed dynamic route:", path);
        return NextResponse.next();
      }
      
      // If we reach here, the admin is trying to access an unauthorized route
      console.log("Admin trying to access unauthorized route:", path);
      return NextResponse.redirect(new URL("/restricted-access", request.url));



    } else if (role === "manager") {
      const managerRoutes = [
        "/dashboard",
        "/proyectos",
        "/analitica",
        "/cursos-y-certificaciones",
        "/cursos-y-certificaciones/agregar-certificacion",
        "/cursos-y-certificaciones/agregar-curso",
      ];
      if (managerRoutes.some((route) => path === route)) {
        return NextResponse.next();
      }

      if (path.startsWith("/cursos-y-certificaciones/editar/")) {
        return NextResponse.next();
      }
    } else if (role === "empleado") {
      const empleadoStaticRoutes = [
        "/dashboard",
        "/proyecto-actual",
        "/cursos-y-certificaciones",
        "/cursos-y-certificaciones/agregar-certificacion",
        "/cursos-y-certificaciones/agregar-curso",
        "/trayectoria",
      ];

      if (empleadoStaticRoutes.some((route) => path === route)) {
        return NextResponse.next();
      }

      if (path.startsWith("/cursos-y-certificaciones/editar/")) {
        return NextResponse.next();
      }
    }
    console.log(
      `Usuario con rol ${role} no tiene permiso para acceder a ${path}`
    );
    return NextResponse.redirect(new URL("/restricted-access", request.url));
  } catch (error) {
    console.error("Error al analizar datos de usuario:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};