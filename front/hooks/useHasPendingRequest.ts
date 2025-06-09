import { useState, useEffect } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface PendingRequestResponse {
  hasPendingRequest: boolean;
  message: string;
}

export const useHasPendingRequest = () => {
  const [hasPendingRequest, setHasPendingRequest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkPendingRequest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const response = await fetch(`${apiUrl}/api/requests/has-pending-assignment-request`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: PendingRequestResponse = await response.json();
      setHasPendingRequest(data.hasPendingRequest);
    } catch (err) {
      console.error("Error checking pending request:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setHasPendingRequest(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPendingRequest();
  }, []);

  return {
    hasPendingRequest,
    isLoading,
    error,
    refreshPendingStatus: checkPendingRequest,
  };
};