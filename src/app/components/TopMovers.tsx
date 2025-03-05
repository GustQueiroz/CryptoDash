"use client";

import { Card, CardContent, Typography, Box, Grid } from "@mui/material";

interface TopMover {
  id: string;
  symbol: string;
  name: string;
  price_change_percentage_24h: number;
}

interface TopMoversProps {
  gainers: TopMover[];
  losers: TopMover[];
}

export default function TopMovers({ gainers, losers }: TopMoversProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card
          sx={{
            backgroundColor: "#0F1215",
            color: "white",
            borderRadius: "12px",
            height: "100%",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
              >
                <Typography sx={{ fontSize: "1.2rem" }}>🚀</Typography>
                <Typography variant="subtitle2" sx={{ color: "#4CAF50" }}>
                  Top Ganhos
                </Typography>
              </Box>
              {gainers.map((coin) => (
                <Box
                  key={coin.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 500,
                      }}
                    >
                      {coin.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {coin.symbol.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#4CAF50", fontWeight: 500 }}
                  >
                    +{coin.price_change_percentage_24h.toFixed(1)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card
          sx={{
            backgroundColor: "#0F1215",
            color: "white",
            borderRadius: "12px",
            height: "100%",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
              >
                <Typography sx={{ fontSize: "1.2rem" }}>📉</Typography>
                <Typography variant="subtitle2" sx={{ color: "#EF5350" }}>
                  Top Perdas
                </Typography>
              </Box>
              {losers.map((coin) => (
                <Box
                  key={coin.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 500,
                      }}
                    >
                      {coin.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {coin.symbol.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#EF5350", fontWeight: 500 }}
                  >
                    {coin.price_change_percentage_24h.toFixed(1)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
