"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import BalanceCard from "./BalanceCard";
import TopMovers from "./TopMovers";
import CryptoCard from "./CryptoCard";
import { useCryptoData } from "../hooks/useCryptoData";

export default function DashboardContent() {
  const [isClient, setIsClient] = useState(false);
  const { cryptocurrencies, loading, getTopGainers, getTopLosers } =
    useCryptoData();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BalanceCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopMovers title="Top Ganhos" cryptos={getTopGainers()} emoji="🚀" />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopMovers title="Top Perdas" cryptos={getTopLosers()} emoji="📉" />
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

        {cryptocurrencies?.slice(0, 30).map((crypto) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={crypto.id}>
            <CryptoCard
              crypto={{
                id: crypto.id,
                rank: crypto.market_cap_rank,
                symbol: crypto.symbol,
                name: crypto.name,
                image: crypto.image,
                current_price: crypto.current_price,
                market_cap: crypto.market_cap,
                volume_24h: crypto.total_volume,
                price_change_24h: crypto.price_change_percentage_24h,
                has_buy_button: true,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
