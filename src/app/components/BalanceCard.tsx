"use client";

import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useCryptoData } from "../hooks/useCryptoData";

export default function BalanceCard() {
  const { user } = useAuth();
  const { cryptocurrencies } = useCryptoData();

  if (!user) return null;

  const wallet = user.wallet;
  const assets = Object.entries(wallet.assets).filter(
    ([symbol]) => symbol !== "USDT"
  );

  // Calcula o lucro/prejuízo total
  const calculateTotalProfit = () => {
    let totalProfit = 0;
    assets.forEach(([symbol, asset]) => {
      const crypto = cryptocurrencies.find(
        (c) => c.symbol.toUpperCase() === symbol
      );
      if (crypto) {
        const currentValue = asset.amount * crypto.current_price;
        const purchaseValue = asset.amount * asset.purchaseValue;
        totalProfit += currentValue - purchaseValue;
      }
    });
    return totalProfit;
  };

  const totalProfit = calculateTotalProfit();
  const profitPercentage = (totalProfit / wallet.totalBalance) * 100;

  return (
    <Card
      sx={{
        backgroundColor: "#0E1215",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <CardContent>
        <Typography variant="h6" color="white" gutterBottom>
          Seu Portfolio
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" color="white">
            $
            {wallet.totalBalance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: totalProfit >= 0 ? "#00C853" : "#FF3D00",
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {totalProfit >= 0 ? "+" : ""}$
            {Math.abs(totalProfit).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span style={{ fontSize: "0.9em" }}>
              ({profitPercentage.toFixed(2)}%)
            </span>
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {assets.map(([symbol, asset]) => {
            const crypto = cryptocurrencies.find(
              (c) => c.symbol.toUpperCase() === symbol
            );
            if (!crypto) return null;

            const currentValue = asset.amount * crypto.current_price;
            const profit = currentValue - asset.amount * asset.purchaseValue;
            const profitPercent =
              (profit / (asset.amount * asset.purchaseValue)) * 100;

            return (
              <Grid item xs={12} key={symbol}>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    p: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="white">{symbol}</Typography>
                    <Typography color="white">
                      {asset.amount.toFixed(6)} {symbol}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                    >
                      $
                      {currentValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: profit >= 0 ? "#00C853" : "#FF3D00",
                      }}
                    >
                      {profit >= 0 ? "+" : ""}
                      {profitPercent.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
