"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingScreen() {
  // Este estado é usado para garantir que o componente seja renderizado apenas no cliente
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // No servidor, retorna um div vazio para evitar hidratação incorreta
  if (!isMounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  // No cliente, renderiza o componente Material UI
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "background.default",
      }}
    >
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h6" color="text.secondary">
        Carregando...
      </Typography>
    </Box>
  );
}
