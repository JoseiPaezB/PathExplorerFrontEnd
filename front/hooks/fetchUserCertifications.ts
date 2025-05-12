"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import type { CertificationsUserResponse } from "@/types/users";
import { apiUrl } from "@/constants";

export function useFetchUserCertifications(userId: string) {
  const [certifications, setCertifications] =
    useState<CertificationsUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCertifications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";

      const response = await axios.get<CertificationsUserResponse>(
        `${apiUrl}/auth/certifications?id_persona=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCertifications(response.data);
    } catch (err) {
      console.error("Error fetching certifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch certifications"
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserCertifications();
  }, [userId]);

  return { certifications, isLoading, error, fetchUserCertifications };
}
