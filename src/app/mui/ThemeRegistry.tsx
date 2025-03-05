"use client";

import { ReactNode, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import EmotionRegistry from "./EmotionRegistry";

// Definição dos temas light e dark
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Apenas executar no cliente para evitar erros de hidratação
  useEffect(() => {
    setMounted(true);
    // Verificar preferência do usuário
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDarkMode);
  }, []);

  // Escolher o tema com base no modo
  const theme = darkMode ? darkTheme : lightTheme;

  // Renderizar uma div vazia no servidor para evitar hidratação incorreta
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionRegistry>
  );
}
