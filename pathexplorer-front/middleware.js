import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const ENABLE_MIDDLEWARE = false; // Cambiar a true  protección de rutas

export function middleware(request) {
  console.log(
    "Middleware ejecutándose para la ruta:",
    request.nextUrl.pathname
  );

  // Desactivar el middleware durante desarrollo
  if (process.env.NODE_ENV === "development" && !ENABLE_MIDDLEWARE) {
    return NextResponse.next();
  }

  const user = request.cookies.get("user")?.value;
  const path = request.nextUrl.pathname;

  // Rutas públicas que no requieren autenticación
  if (path === "/login" || path === "/recuperar-password") {
    if (user) {
      console.log(
        "Usuario autenticado intentando acceder a /login, redirigiendo a /dashboard"
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Rutas protegidas
  if (!user) {
    console.log(
      "Usuario no autenticado intentando acceder a ruta protegida, redirigiendo a /login"
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Control de acceso basado en roles
  try {
    const userData = user ? JSON.parse(user) : null;
    const role = userData?.role;

    // Rutas solo para administradores
    if (path.startsWith("/admin") && role !== "administrator") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Rutas solo para gerentes
    if (path.startsWith("/manager") && role !== "manager") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    console.error("Error al analizar datos de usuario:", error);
    // En caso de error, redirigir a login para obtener datos válidos
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
