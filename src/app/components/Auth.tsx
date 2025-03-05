"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export default function Auth() {
  const { login, checkAuth } = useAuth();

  const [name, setName] = useState("");
  const [initialBalance, setInitialBalance] = useState("5000");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Digite seu nome");
      return;
    }

    const balance = parseFloat(initialBalance);
    if (isNaN(balance) || balance <= 0) {
      setError("Saldo inicial inválido");
      return;
    }

    try {
      login({
        id: "user-" + Date.now(),
        name: name,
        email: "usuario@exemplo.com",
        initialBalance: balance,
      });

      setTimeout(() => {
        checkAuth();
      }, 100);
    } catch {
      setError("Erro ao entrar");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          width: "100%",
          backgroundColor: "#1A1A1A",
          color: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="div"
            sx={{
              textAlign: "center",
              mb: 3,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            CryptoDash
          </Typography>

          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
              Entre para começar
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Nome Completo"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2196F3",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .Mui-focused": {
                    color: "#2196F3",
                  },
                }}
              />
              <TextField
                label="Saldo Inicial"
                variant="outlined"
                fullWidth
                margin="normal"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: "white" }}>
                      USD
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2196F3",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .Mui-focused": {
                    color: "#2196F3",
                  },
                }}
              />
              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  mb: 2,
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                  fontSize: "1rem",
                }}
              >
                Entrar
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
