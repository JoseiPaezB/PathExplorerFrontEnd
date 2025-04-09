// For Pages Router:
// Save this file as pages/unauthorized.tsx

// For App Router:
// Save this file as app/unauthorized/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Force a hard redirect to dashboard when clicking the button
  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };
  
  // Force a hard navigation back
  const goBack = () => {
    window.history.back();
  };
  
  // Make sure this page can be accessed even when not authenticated
  useEffect(() => {
    console.log("Unauthorized page loaded");
    console.log("User authenticated:", isAuthenticated);
    console.log("User role:", user?.role);
  }, [user, isAuthenticated]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="border-none shadow-card">
          <CardHeader className="pb-4 text-center bg-red-50 rounded-t-lg">
            <div className="mx-auto mb-2 rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Acceso No Autorizado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 text-center">
            <p className="text-gray-600 mb-2">
              No tienes permisos para acceder a esta página.
            </p>
            {user && (
              <p className="text-sm text-gray-500">
                Tu rol actual ({user.role}) no tiene los permisos necesarios para acceder a este recurso.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pb-6 space-x-3">
            <Button
              variant="default"
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              onClick={goToDashboard}
            >
              <Home className="h-4 w-4" />
              <span>Ir al Dashboard</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}