"use client";

import { useState, useEffect } from "react";
import { Container, Grid, Typography, Box, Fade } from "@mui/material";
import BalanceCard from "../components/BalanceCard";
import TopMovers from "../components/TopMovers";
import CryptoCard from "../components/CryptoCard";
import { useCryptoData } from "../hooks/useCryptoData";
import { useRouter } from "next/navigation";
import useAuthStore, { checkIsAuthenticated } from "../store/useAuthStore";
import LoadingScreen from "../components/LoadingScreen";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { cryptocurrencies, loading, getTopGainers, getTopLosers } =
    useCryptoData();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isUserAuthenticated = checkIsAuthenticated();

  if (!isClient || loading || isLoading) {
    return <LoadingScreen />;
  }

  if (!isUserAuthenticated || !user) {
    console.log("Dashboard - Usuário não autenticado");
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapCryptoData = (crypto: any) => ({
    id: crypto.id,
    rank: crypto.market_cap_rank || 0,
    symbol: crypto.symbol,
    name: crypto.name,
    image: crypto.image,
    current_price: crypto.current_price,
    market_cap: crypto.market_cap,
    volume_24h: crypto.total_volume || 0,
    price_change_24h: crypto.price_change_percentage_24h || 0,
    price_change_percentage_24h: crypto.price_change_percentage_24h || 0,
  });

  const topGainers = getTopGainers().map(mapCryptoData);
  const topLosers = getTopLosers().map(mapCryptoData);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CryptoDash
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Olá, {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard de Criptomoedas
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Bem-vindo à sua dashboard de criptomoedas. Aqui você pode gerenciar
            sua carteira e acompanhar o mercado.
          </p>
        </div>

        <Fade in={true} timeout={800}>
          <Container
            maxWidth="xl"
            sx={{
              py: 4,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "200px",
                background:
                  "linear-gradient(180deg, rgba(33,150,243,0.05) 0%, rgba(33,150,243,0) 100%)",
                borderRadius: "20px",
                zIndex: -1,
              },
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Fade in={true} timeout={1000}>
                  <div>
                    <BalanceCard />
                  </div>
                </Fade>
              </Grid>
              <Grid item xs={12} md={4}>
                <Fade in={true} timeout={1200}>
                  <div>
                    <TopMovers
                      title="Top Ganhos"
                      cryptos={topGainers}
                      emoji="🚀"
                    />
                  </div>
                </Fade>
              </Grid>
              <Grid item xs={12} md={4}>
                <Fade in={true} timeout={1400}>
                  <div>
                    <TopMovers
                      title="Top Perdas"
                      cryptos={topLosers}
                      emoji="📉"
                    />
                  </div>
                </Fade>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 4,
                    mb: 2,
                    px: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: "bold",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -8,
                        left: 0,
                        width: "40px",
                        height: "3px",
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        borderRadius: "10px",
                      },
                    }}
                  >
                    Todas as Criptomoedas
                  </Typography>
                </Box>
              </Grid>

              {cryptocurrencies?.slice(0, 30).map((crypto, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={crypto.id}>
                  <Fade
                    in={true}
                    timeout={1500 + index * 50}
                    style={{ transitionDelay: `${50 * index}ms` }}
                  >
                    <div>
                      <CryptoCard
                        crypto={{
                          id: crypto.id,
                          rank: crypto.market_cap_rank || 0,
                          symbol: crypto.symbol,
                          name: crypto.name,
                          image: crypto.image,
                          current_price: crypto.current_price,
                          market_cap: crypto.market_cap,
                          volume_24h: crypto.total_volume || 0,
                          price_change_24h:
                            crypto.price_change_percentage_24h || 0,
                          price_change_percentage_24h:
                            crypto.price_change_percentage_24h || 0,
                          has_buy_button: true,
                        }}
                      />
                    </div>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Fade>
      </main>
    </div>
  );
}
