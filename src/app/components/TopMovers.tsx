"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Crypto } from "./CryptoCard";
import Image from "next/image";
export interface TopMoversProps {
  title?: string;
  cryptos: Crypto[];
  emoji: string;
}

export default function TopMovers({ title, cryptos, emoji }: TopMoversProps) {
  // Adicionando verificação para evitar erro se cryptos for undefined
  if (!cryptos || !Array.isArray(cryptos)) {
    return (
      <Card
        sx={{
          backgroundColor: "#0F1215",
          borderRadius: "12px",
          height: "100%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {emoji} {title || (emoji === "🚀" ? "Top Ganhos" : "Top Perdas")}
          </Typography>
          <Typography variant="body2">Carregando dados...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        backgroundColor: "#0F1215",
        borderRadius: "12px",
        height: "100%",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
          {emoji} {title || (emoji === "🚀" ? "Top Ganhos" : "Top Perdas")}
        </Typography>
        <List sx={{ p: 0 }}>
          {cryptos.map((crypto) => {
            const priceChangeColor =
              crypto.price_change_24h >= 0 ? "#00C853" : "#FF3D00";
            const priceChangeSymbol = crypto.price_change_24h >= 0 ? "+" : "";

            return (
              <ListItem
                key={crypto.id}
                sx={{
                  px: 0,
                  py: 1,

                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Image
                          src={crypto.image}
                          alt={crypto.name}
                          width={24}
                          height={24}
                          style={{ borderRadius: "50%", marginRight: "20px" }}
                        />
                        <Typography variant="body1" color="white">
                          {crypto.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ ml: 1, color: "rgba(255, 255, 255, 0.6)" }}
                        >
                          {crypto.symbol}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: priceChangeColor, fontWeight: "bold" }}
                      >
                        {priceChangeSymbol}
                        {crypto.price_change_24h.toFixed(1)}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
