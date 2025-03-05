"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleInitialClick = () => {
    router.push("/");
  };

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
        <Box
          onClick={handleInitialClick}
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
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
              onClick={handleProfileClick}
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#4311b8",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "#431e97",
                  transform: "scale(1.05)",
                  boxShadow: "0 0 10px rgba(67, 30, 151, 0.5)",
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
