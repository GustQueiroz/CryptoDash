"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore, { checkIsAuthenticated } from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const publicRoutes = ["/login", "/register"];

const protectedRoutes = ["/dashboard"];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (!isMounted || redirected || isLoading) return;

    const isUserAuthenticated = checkIsAuthenticated();
    console.log("ProtectedRoute - Verificando rota:", {
      pathname,
      isAuth: isUserAuthenticated,
      isLoading,
    });

    if (pathname === "/") {
      setRedirected(true);
      if (isUserAuthenticated) {
        console.log("Redirecionando raiz para dashboard");
        router.push("/dashboard");
      } else {
        console.log("Redirecionando raiz para login");
        router.push("/login");
      }
    } else if (
      !isUserAuthenticated &&
      protectedRoutes.some((route) => pathname.startsWith(route))
    ) {
      console.log("Usuário não autenticado em rota protegida");
      setRedirected(true);
      router.push("/login");
    } else if (isUserAuthenticated && publicRoutes.includes(pathname)) {
      console.log("Usuário autenticado em rota pública");
      setRedirected(true);
      router.push("/dashboard");
    }
  }, [isMounted, pathname, router, redirected, isLoading]);

  useEffect(() => {
    setRedirected(false);
  }, [pathname]);

  if (!isMounted || isLoading) return null;

  const isAuthenticated = checkIsAuthenticated();

  if (
    !isAuthenticated &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return null;
  }

  return <>{children}</>;
}
