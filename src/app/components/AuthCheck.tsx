"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import Auth from "./Auth";

interface AuthCheckProps {
  children: React.ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth();
    }, 1000);

    return () => clearInterval(interval);
  }, [checkAuth]);

  if (!isClient || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <>{children}</>;
}
