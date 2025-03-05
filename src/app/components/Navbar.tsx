"use client";

import React from "react";

import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#111111",
        boxShadow: "none",
        mb: 2,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              ml: 1,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #276dbd 30%, #9d32ce 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CryptoDash
          </Typography>
        </Box>

        {user && (
          <Box
            sx={{ display: "flex", alignItems: "center", marginRight: "20px" }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#4311b8 ",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontWeight: "bold",
                hover: {
                  bgcolor: "#431e97",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
