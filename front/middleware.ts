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
        "Usuario autenticado intentando acceder a /login, redirigiendo a /dashboard"
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
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
      "/dashboard",
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

    if (role === "administrador") {
      const adminRoutes = ["/usuarios", "/autorizaciones", "/departamentos"];
      if (adminRoutes.some((route) => path === route)) {
        return NextResponse.next();
      }
    } else if (role === "manager") {
      const managerRoutes = [
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
