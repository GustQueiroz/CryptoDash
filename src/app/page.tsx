"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "./store/useAuthStore";
import LoadingScreen from "./components/LoadingScreen";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (isAuthenticated) {
      console.log("Usuário autenticado, redirecionando para dashboard");
      router.push("/dashboard");
    } else {
      console.log("Usuário não autenticado, redirecionando para login");
      router.push("/login");
    }
  }, [isAuthenticated, router, isMounted]);

  return <LoadingScreen />;
}
