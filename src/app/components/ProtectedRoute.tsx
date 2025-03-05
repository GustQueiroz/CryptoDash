"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore, { checkIsAuthenticated } from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Rotas públicas que NÃO precisam de autenticação
const publicRoutes = ["/login", "/register"];

// Rotas que requerem autenticação
const protectedRoutes = ["/dashboard"];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [redirected, setRedirected] = useState(false);

  // Este efeito verifica se estamos no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Este efeito faz a verificação de autenticação e redireciona se necessário
  useEffect(() => {
    // Não faz nada se não estiver no cliente ou já redirecionou
    if (!isMounted || redirected || isLoading) return;

    const isUserAuthenticated = checkIsAuthenticated();
    console.log("ProtectedRoute - Verificando rota:", {
      pathname,
      isAuth: isUserAuthenticated,
      isLoading,
    });

    // Lógica de redirecionamento simplificada
    // Caso 1: Rota raiz
    if (pathname === "/") {
      setRedirected(true);
      if (isUserAuthenticated) {
        console.log("Redirecionando raiz para dashboard");
        router.push("/dashboard");
      } else {
        console.log("Redirecionando raiz para login");
        router.push("/login");
      }
    }
    // Caso 2: Rota protegida e usuário não autenticado
    else if (
      !isUserAuthenticated &&
      protectedRoutes.some((route) => pathname.startsWith(route))
    ) {
      console.log("Usuário não autenticado em rota protegida");
      setRedirected(true);
      router.push("/login");
    }
    // Caso 3: Rota pública e usuário autenticado
    else if (isUserAuthenticated && publicRoutes.includes(pathname)) {
      console.log("Usuário autenticado em rota pública");
      setRedirected(true);
      router.push("/dashboard");
    }
  }, [isMounted, pathname, router, redirected, isLoading]);

  // Resetar o estado de redirecionamento quando a rota mudar
  useEffect(() => {
    setRedirected(false);
  }, [pathname]);

  // Se não estiver no cliente, ou se estivermos carregando, mostra nada
  if (!isMounted || isLoading) return null;

  // Verificar se o usuário tem permissão para a rota atual
  const isAuthenticated = checkIsAuthenticated();

  // Não renderiza conteúdo para rotas protegidas se não estiver autenticado
  if (
    !isAuthenticated &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return null;
  }

  return <>{children}</>;
}
