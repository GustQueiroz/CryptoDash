"use client";

import { Box, Card, Typography } from "@mui/material";
import Image from "next/image";
import { Crypto } from "./CryptoCard";

interface TopMoversProps {
  title: string;
  cryptos: Crypto[];
  emoji: string;
}

export default function TopMovers({ title, cryptos, emoji }: TopMoversProps) {
  return (
    <Card
      sx={{
        backgroundColor: "#0E1215",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        p: 2,
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "white",
        }}
      >
        {title} {emoji}
      </Typography>

      {cryptos.map((crypto) => (
        <Box
          key={crypto.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.5,

            borderRadius: "8px",
            "&:last-child": { mb: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Image
              src={crypto.image}
              alt={crypto.name}
              width={24}
              height={24}
              style={{ borderRadius: "50%" }}
            />
            <Box>
              <Typography variant="body1" color="white">
                {crypto.symbol.toUpperCase()}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                {crypto.name}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color:
                crypto.price_change_percentage_24h >= 0 ? "#00C853" : "#FF3D00",
              fontWeight: "bold",
            }}
          >
            {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </Typography>
        </Box>
      ))}
    </Card>
  );
}
