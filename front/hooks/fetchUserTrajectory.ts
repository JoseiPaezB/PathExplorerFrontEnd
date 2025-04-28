import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/constants";
import { UserTrajectoryResponse } from "@/types/users";

export function useFetchUserTrajectory(userId: string) {
  const [trajectory, setTrajectory] = useState<UserTrajectoryResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTrajectory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";
      const response = await axios.get<UserTrajectoryResponse>(
        `${apiUrl}/auth/trajectory-and-goals?id_persona=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrajectory(response.data);
    } catch (err) {
      console.error("Error fetching trajectory:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch trajectory"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTrajectory();
  }, [userId]);

  return {
    trajectory,
    isLoading,
    error,
    fetchUserTrajectory,
  };
}
