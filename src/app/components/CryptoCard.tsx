"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { useTradeOperations } from "../hooks/useTradeOperations";
import { useAuth } from "../hooks/useAuth";

export interface Crypto {
  id: string;
  rank: number;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
  has_buy_button?: boolean;
}

interface CryptoCardProps {
  crypto: Crypto;
}

export default function CryptoCard({ crypto }: CryptoCardProps) {
  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { calculatePurchase, executePurchase } = useTradeOperations();
  const { user } = useAuth();

  const priceChangeColor = crypto.price_change_24h >= 0 ? "#00C853" : "#FF3D00";
  const priceChangeSymbol = crypto.price_change_24h >= 0 ? "+" : "";

  const handleBuy = async () => {
    if (!quantity || isNaN(Number(quantity))) {
      setError("Por favor, insira uma quantidade válida");
      return;
    }

    const amount = Number(quantity);
    const totalValue = amount * crypto.current_price;

    if (totalValue < 10) {
      setError("O valor mínimo de compra é $10");
      return;
    }

    const result = await executePurchase(crypto.symbol, amount);

    if (result.success) {
      setOpenSnackbar(true);
      setOpenBuyDialog(false);
      setQuantity("");
      setError(null);

      console.log(
        "Estado atual do localStorage após a compra:",
        JSON.parse(localStorage.getItem("user") || "{}")
      );
    } else {
      setError(result.message);
    }
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#1A1F24",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    boxShadow: 24,
    p: 4,
    color: "white",
  };

  const calculation = quantity
    ? calculatePurchase(crypto.symbol, Number(quantity))
    : null;

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#0E1215",
          borderRadius: "12px",
          overflow: "hidden",
          height: "100%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src={crypto.image}
                alt={crypto.name}
                width={32}
                height={32}
                style={{ borderRadius: "50%" }}
              />
              <Box sx={{ ml: 1.5 }}>
                <Typography variant="h6" component="div" color="white">
                  {crypto.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="rgba(255, 255, 255, 0.6)"
                  sx={{ textTransform: "uppercase" }}
                >
                  {crypto.symbol}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="caption"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "white",
                px: 1,
                py: 0.5,
                borderRadius: "4px",
                alignSelf: "flex-start",
              }}
            >
              #{crypto.rank}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
              Preço
            </Typography>
            <Typography variant="h6" color="white">
              USD {crypto.current_price.toLocaleString("pt-BR")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                Cap. Mercado
              </Typography>
              <Typography variant="body2" color="white">
                R$ {(crypto.market_cap / 1e9).toFixed(2)} bi
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                Volume 24h
              </Typography>
              <Typography variant="body2" color="white">
                R$ {(crypto.volume_24h / 1e9).toFixed(2)} bi
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: priceChangeColor, fontWeight: "bold" }}
            >
              {priceChangeSymbol}
              {crypto.price_change_24h.toFixed(1)}%{" "}
              <span style={{ fontSize: "0.75rem" }}>24h</span>
            </Typography>
            {crypto.has_buy_button && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpenBuyDialog(true)}
                sx={{
                  backgroundColor: "#2196F3",
                  "&:hover": {
                    backgroundColor: "#1976D2",
                  },
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Comprar
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Modal
        open={openBuyDialog}
        onClose={() => {
          setOpenBuyDialog(false);
          setQuantity("");
          setError(null);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Comprar {crypto.name}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: "rgba(255, 255, 255, 0.7)" }}
            >
              Preço atual: ${crypto.current_price.toLocaleString("en-US")}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Saldo disponível: $
              {user?.wallet.assets.USDT.amount.toLocaleString("en-US")}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 1 }}
            >
              Valor mínimo de compra: $10
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Quantidade"
            variant="outlined"
            type="number"
            value={quantity}
            onChange={(event) => {
              const value = event.target.value;
              setQuantity(value);
              if (value) {
                const totalValue = Number(value) * crypto.current_price;
                if (totalValue < 10) {
                  setError("O valor mínimo de compra é $10");
                } else {
                  setError(null);
                }
              }
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />

          {calculation && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                Custo total: ${calculation.totalCost.toLocaleString("en-US")}
              </Typography>
            </Box>
          )}

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={() => setOpenBuyDialog(false)}
              sx={{ color: "white" }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleBuy}
              disabled={!!error || !quantity}
              sx={{
                backgroundColor: "#2196F3",
                "&:hover": {
                  backgroundColor: "#1976D2",
                },
              }}
            >
              Comprar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar para mostrar mensagem de sucesso */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Compra realizada com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
}
