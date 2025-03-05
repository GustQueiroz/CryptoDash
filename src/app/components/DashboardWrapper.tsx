"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import Auth from "./Auth";
import DashboardContent from "./DashboardContent";

export default function DashboardWrapper() {
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth();
    }, 500);

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

  return <DashboardContent />;
}
