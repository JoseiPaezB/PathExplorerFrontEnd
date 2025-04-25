"use server";
import { UserInfoBanca } from "@/types/users";
import { revalidatePath } from "next/cache";

export interface BestCandidatesResponse {
  success: boolean;
  message?: string;
  candidates?: UserInfoBanca[];
}

export async function getBestCandidatesForRole(
  roleId: number,
  token?: string
): Promise<BestCandidatesResponse> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Usar directamente POST ya que es el que funciona
    const url = `http://localhost:4000/api/projects/best-candidates-for-role`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ id_rol: roleId })
    });
    
    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || response.statusText;
      } catch (e) {
        // Si no es JSON, usamos el statusText
      }
      
      throw new Error(`Error al obtener los mejores candidatos para el rol: ${errorMessage}`);
    }
    
    // Obtener datos y loggear para depuración
    const data = await response.json();
    console.log("DATOS RECIBIDOS DE API:", data);
    
    // Procesamiento más detallado para asegurar que se manejan correctamente
    let candidatos = [];
    
    if (Array.isArray(data)) {
      // Si es un array directo
      candidatos = data;
    } else if (data.candidates && Array.isArray(data.candidates)) {
      // Si tiene una propiedad candidates que es array
      candidatos = data.candidates;
    } else if (data.data && Array.isArray(data.data)) {
      // Si tiene una propiedad data que es array
      candidatos = data.data;
    } else if (typeof data === 'object' && data !== null) {
      // Si es un objeto único
      candidatos = [data];
    }
    
    // Verificar la estructura de los datos para facilitar depuración
    console.log("ESTRUCTURA PROCESADA:", candidatos);
    
    revalidatePath("/proyectos");
    
    return {
      success: true,
      candidates: candidatos
    };
    
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido"
    };
  }
}