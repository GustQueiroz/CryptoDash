"use client";

import React from "react";

import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#0A0A0A", boxShadow: "none", mb: 2 }}
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#4311b8 ",
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                color: "linear-gradient(45deg, #4311b8 30%, #c221f3 90%)",
              }}
            >
              {user.name}
            </Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
