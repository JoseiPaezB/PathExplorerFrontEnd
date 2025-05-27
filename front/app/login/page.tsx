"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login, isAuthenticated, user, isLoggingOut } = useAuth();

  // Helper function to get redirect path based on user role
  const getRedirectPath = (userRole: string) => {
    if (userRole === "administrador") {
      return "/usuarios";
    } else {
      return "/dashboard";
    }
  };

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user && !isLoggingOut && !isRedirecting) {
      setIsRedirecting(true);
      const redirectPath = getRedirectPath(user.role);
      setTimeout(() => {
        router.push(redirectPath);
      }, 100);
    }
  }, [isAuthenticated, user, router, isLoggingOut, isRedirecting]);

  // Resetear el estado de redirección cuando terminamos de hacer logout
  useEffect(() => {
    if (!isLoggingOut && !isAuthenticated) {
      setIsRedirecting(false);
    }
  }, [isLoggingOut, isAuthenticated]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 10;
      const y = (e.clientY / window.innerHeight) * 10;
      setBackgroundPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || isRedirecting) return;

    setIsLoading(true);
    setError("");

    try {
      const loggedInUser = await login(email, password);
      setSuccess(true);


      const redirectPath = loggedInUser ? getRedirectPath(loggedInUser.role) : "/dashboard";
      const redirectPath = loggedInUser
        ? getRedirectPath(loggedInUser.role)
        : "/dashboard";

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al Sistema de Gestión de Talentos",
      });

      setIsRedirecting(true);

      setTimeout(() => {
        router.push(redirectPath);
      }, 1200);
    } catch (error) {
      setError("Por favor, verifica tus credenciales e intenta nuevamente");
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-muted p-4 overflow-hidden"
      style={{
        backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
        backgroundSize: "120% 120%",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-primary/10" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md z-10"
      >
        <Card className="overflow-hidden border-none shadow-xl bg-white/90 backdrop-blur-xl">
          <CardHeader className="relative z-10 space-y-1 pb-8 pt-8">
            <motion.div
              className="flex justify-center mb-6"
              variants={itemVariants}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3,
                }}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
                  alt="Accenture Logo"
                  className="h-20 w-20"
                />
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold text-center">
                Accenture HR
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-center">
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10 pb-6">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: 0.2,
                    }}
                    className="mb-4 rounded-full bg-primary/10 p-3"
                  >
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">
                    ¡Inicio de sesión exitoso!
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Redirigiendo...
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleLogin}
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nombre@accenture.com"
                        className="pl-10 h-12 rounded-xl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </motion.div>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Contraseña
                      </Label>
                      <Link
                        href="/recuperar-password"
                        className="text-sm text-primary hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        className="pl-10 h-12 rounded-xl"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full h-12 mt-2 bg-primary hover:bg-primary/90 rounded-xl transition-all duration-300"
                      disabled={isLoading || isRedirecting}
                    >
                      {isLoading ? (
                        <motion.div
                          className="flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Iniciando sesión...
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex items-center justify-center"
                          whileHover={{ x: 5 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          Iniciar sesión
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="relative z-10 flex flex-col space-y-4 border-t bg-muted/30 px-6 py-4">
            <div className="text-xs text-muted-foreground flex items-center justify-center">
              <Lock className="h-3 w-3 mr-1 text-primary" />
              Conexión segura SSL/TLS
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}