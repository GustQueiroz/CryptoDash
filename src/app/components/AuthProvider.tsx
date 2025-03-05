"use client";

import { useEffect, useState } from "react";
import useAuthStore, { checkIsAuthenticated } from "../store/useAuthStore";
import authService from "../services/authService";
import ProtectedRoute from "./ProtectedRoute";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { token, setAuth, logout, setLoading } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const isAuthenticated = checkIsAuthenticated();
    console.log("AuthProvider - Inicialização:", {
      isAuthenticated,
      hasToken: !!token,
    });

    if (!token) {
      setLoading(false);
    }
  }, [token, setLoading]);

  useEffect(() => {
    if (!isMounted || !token) return;

    const validateToken = async () => {
      try {
        console.log("Validando token JWT...");
        const response = await authService.validateToken(token);

        setAuth(response.token, response.user);
        console.log("Token JWT válido");
      } catch (error) {
        console.error("Token JWT inválido:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [isMounted, token, setAuth, logout, setLoading]);

  if (!isMounted) {
    return null;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
