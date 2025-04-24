import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ENABLE_MIDDLEWARE = true // Set to true to enable route protection

export function middleware(request: NextRequest) {
  console.log("Middleware ejecutándose para la ruta:", request.nextUrl.pathname)

  // Desactivar el middleware durante desarrollo
  if (process.env.NODE_ENV === "development" && !ENABLE_MIDDLEWARE) {
    return NextResponse.next()
  }

  const user = request.cookies.get("user")?.value
  const path = request.nextUrl.pathname

  // Allow access to the restricted-access page even if not authenticated
  if (path === "/restricted-access") {
    return NextResponse.next()
  }

  // Rutas públicas que no requieren autenticación
  if (path === "/login" || path === "/recuperar-password") {
    if (user) {
      console.log("Usuario autenticado intentando acceder a /login, redirigiendo a /dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // Rutas protegidas
  if (!user) {
    console.log("Usuario no autenticado intentando acceder a ruta protegida, redirigiendo a /login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Control de acceso basado en roles
  try {
    const userData = user ? JSON.parse(user) : null
    const role = userData?.role

    // Rutas comunes para todos los roles
    const commonRoutes = ["/dashboard", "/perfil", "/configuracion"]
    if (commonRoutes.includes(path)) {
      return NextResponse.next()
    }

    // Rutas específicas por rol
    if (role === "administrador") {
      const adminRoutes = ["/usuarios", "/autorizaciones", "/departamentos"]
      if (adminRoutes.includes(path)) {
        return NextResponse.next()
      }
    } 
    else if (role === "manager") {
      const managerRoutes = ["/proyectos", "/equipo", "/analitica"]
      if (managerRoutes.includes(path)) {
        return NextResponse.next()
      }
    }
    else if (role === "empleado") {
      const empleadoRoutes = ["/proyecto-actual", "/cursos", "/analitica"]
      if (empleadoRoutes.includes(path)) {
        return NextResponse.next()
      }
    }

    // Si llega aquí, el usuario no tiene permiso para acceder a la ruta
    console.log(`Usuario con rol ${role} no tiene permiso para acceder a ${path}`)
    // Redirigir a la página de acceso restringido
    return NextResponse.redirect(new URL("/restricted-access", request.url))
  } catch (error) {
    console.error("Error al analizar datos de usuario:", error)
    // En caso de error, redirigir a login para obtener datos válidos
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}