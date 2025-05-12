"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LockIcon, AlertTriangleIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RestrictedAccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary-600 p-6 flex justify-center">
          <div className="bg-white rounded-full p-3">
            <LockIcon className="h-12 w-12 text-primary-600" />
          </div>
        </div>

        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Restringido
          </h1>

          <div className="flex items-center justify-center mb-4">
            <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm font-medium text-red-600">
              No tienes permiso para acceder a esta página
            </p>
          </div>

          <p className="text-gray-600 mb-6">
            Esta página está restringida para tu perfil de usuario. Por favor,
            regresa al Dashboard o contacta al administrador si crees que
            deberías tener acceso.
          </p>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white transition-all duration-150 transform hover:shadow-md active:scale-95"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>

            <Link
              href="/perfil"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Ir a tu perfil
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Si necesitas asistencia, contacta al equipo de soporte técnico.
      </p>
    </div>
  );
}
