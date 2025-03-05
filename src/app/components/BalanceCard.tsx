"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function BalanceCard() {
  const { user } = useAuth();
  const [totalBalance, setTotalBalance] = useState(0);
  const [dayChange, setDayChange] = useState(2.5); // Valor fixo para exemplo
  const [profit30d, setProfit30d] = useState(1245.0); // Valor fixo para exemplo
  const [totalProfit, setTotalProfit] = useState(5432.0); // Valor fixo para exemplo

  useEffect(() => {
    if (user) {
      let cryptoValue = 0;
      setTotalBalance(user.wallet.balance + cryptoValue);
    }
  }, [user]);

  return (
    <Card
      sx={{
        backgroundColor: "#0F1215",
        color: "white",
        borderRadius: "12px",
        width: "100%",
        height: "100%",
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
            Atualizado há 2 min
          </Typography>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: "bold", color: "#FFFFFF", marginBottom: "8px" }}
          >
            R${" "}
            {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </Typography>
          <Typography variant="body2" sx={{ color: "#4CAF50" }}>
            +{dayChange}% nas últimas 24h
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
            <Typography variant="body1" sx={{ color: "#4CAF50" }}>
              + R${" "}
              {profit30d.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Typography>
          </div>
          <div>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FFFFFF", opacity: 0.7, marginBottom: "4px" }}
            >
              Lucro Total
            </Typography>
            <Typography variant="body1" sx={{ color: "#4CAF50" }}>
              + R${" "}
              {totalProfit.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
