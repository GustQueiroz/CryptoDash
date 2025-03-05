"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

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
  const priceChangeColor = crypto.price_change_24h >= 0 ? "#00C853" : "#FF3D00";
  const priceChangeSymbol = crypto.price_change_24h >= 0 ? "+" : "";

  return (
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
            R$ {crypto.current_price.toLocaleString("pt-BR")}
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
  );
}
