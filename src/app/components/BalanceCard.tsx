"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function BalanceCard() {
  const { user, getTotalBalance } = useAuth();
  const [totalBalance, setTotalBalance] = useState(0);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    if (user) {
      const currentBalance = getTotalBalance();
      setTotalBalance(currentBalance);

      const initialBalance = user.wallet.assets.USDT.amount;
      const percentageChange =
        ((currentBalance - initialBalance) / initialBalance) * 100;
      const profitValue = currentBalance - initialBalance;

      setProfitPercentage(percentageChange);
      setTotalProfit(profitValue);
    }
  }, [user, getTotalBalance]);

  const getProfitColor = (value: number) => {
    if (value > 0) return "#4CAF50";
    if (value < 0) return "#FF4444";
    return "#8BC34A";
  };

  const formatPercentage = (percentage: number) => {
    const prefix = percentage > 0 ? "+" : "";
    return `${prefix}${percentage.toFixed(2)}%`;
  };

  return (
    <Card
      sx={{
        backgroundColor: "#0F1215",
        color: "white",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: "#FFFFFF", opacity: 0.7 }}
          >
            Saldo Total
          </Typography>
          <Typography variant="caption" sx={{ color: "#FFFFFF", opacity: 0.7 }}>
            Atualizado agora
          </Typography>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: "bold", color: "#FFFFFF", marginBottom: "4px" }}
          >
            R${" "}
            {(totalBalance * 5.8).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#9E9E9E", marginBottom: "8px" }}
          >
            ${" "}
            {totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
            USD
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: getProfitColor(profitPercentage) }}
          >
            {formatPercentage(profitPercentage)} nas últimas 24h
          </Typography>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FFFFFF", opacity: 0.7, marginBottom: "4px" }}
            >
              Lucro 30 dias
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: getProfitColor(profitPercentage) }}
            >
              {formatPercentage(profitPercentage)}
            </Typography>
          </div>
          <div>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FFFFFF", opacity: 0.7, marginBottom: "4px" }}
            >
              Lucro Total
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: getProfitColor(totalProfit) }}
            >
              {totalProfit > 0 ? "+" : ""}${" "}
              {totalProfit.toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
