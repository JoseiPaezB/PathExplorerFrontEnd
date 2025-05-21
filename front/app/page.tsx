"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";

export default function RootPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect after auth state is determined (not loading)
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        console.log("No authenticated user, redirecting to login");
        router.push("/login");
      } else {
        console.log(`User role detected in page.tsx:`, user.role);
        
        // Redirect based on user role
        if (user.role === "administrador") {
          console.log("Redirecting admin to /usuarios");
          router.push("/usuarios");
        } else if (user.role === "manager" || user.role === "empleado") {
          console.log("Redirecting employee/manager to /dashboard");
          router.push("/dashboard");
        } else {
          // Fallback for unknown roles
          console.warn(`Unknown role: ${user.role}`);
          router.push("/login");
        }
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Show a loading animation while determining where to redirect
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
          alt="Logo"
          className="h-16 w-17 mb-4"
        />
        <div className="h-1 w-48 bg-gray-100 overflow-hidden rounded-full">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
            className="h-full w-1/3 bg-primary rounded-full"
          />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Redireccionando...</p>
      </div>
    </div>
  );
}