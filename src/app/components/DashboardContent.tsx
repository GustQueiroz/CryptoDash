"use client";

import { useState, useEffect } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import BalanceCard from "./BalanceCard";
import TopMovers from "./TopMovers";
import CryptoCard from "./CryptoCard";
import { useCryptoUpdater } from "../hooks/useCryptoUpdater";

export default function DashboardContent() {
  const [isClient, setIsClient] = useState(false);
  const { cryptoData, lastUpdateTime } = useCryptoUpdater();
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!lastUpdateTime) return;

    const timer = setInterval(() => {
      const seconds = Math.floor(
        (new Date().getTime() - lastUpdateTime.getTime()) / 1000
      );
      setSecondsSinceUpdate(seconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdateTime]);

  if (!isClient) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BalanceCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopMovers
            title="Top Ganhos"
            cryptos={cryptoData?.top_gainers || []}
            emoji="🚀"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopMovers
            title="Top Perdas"
            cryptos={cryptoData?.top_losers || []}
            emoji="📉"
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              mb: 1,
            }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
              Todas as Criptomoedas
            </Typography>
          </Box>
        </Grid>

        {cryptoData?.cryptocurrencies?.slice(0, 28).map((crypto) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={crypto.id}>
            <CryptoCard crypto={crypto} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
