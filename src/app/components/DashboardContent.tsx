"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import BalanceCard from "./BalanceCard";
import TopMovers from "./TopMovers";
import CryptoCard from "./CryptoCard";
import { cryptoData } from "../mock/cryptoData";
import { useAuth } from "../hooks/useAuth";

export default function DashboardContent() {
  const [isClient, setIsClient] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (loading) {
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <BalanceCard />
        </Grid>
        <Grid item xs={12} md={7}>
          <TopMovers
            gainers={cryptoData.top_gainers}
            losers={cryptoData.top_losers}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {cryptoData.cryptocurrencies.map((crypto) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={crypto.id}>
                <CryptoCard crypto={crypto} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
