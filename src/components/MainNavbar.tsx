"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import CasinoIcon from "@mui/icons-material/Casino";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useColorScheme } from "@mui/material/styles";
import styles from "@/styles/MainNavbar.module.css";

export default function MainNavbar() {
  const { mode, systemMode, setMode } = useColorScheme();

  const toggleDarkTheme = React.useCallback(() => {
    if (mode) {
      const currMode = mode === "dark" ? "light" : "dark";
      setMode(currMode);
    }
  }, [mode, systemMode, setMode]);

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            <IconButton
              href="/"
              aria-label="home-icon"
              className={styles.navbarIconButton}
            >
              <CasinoIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Tim&apos;s Games
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              href="/"
              aria-label="home-icon"
              className={styles.navbarIconButton}
            >
              <CasinoIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0, pr: 2 }}>
            <Tooltip title="Toggle Theme">
              <IconButton
                size="large"
                color="inherit"
                onClick={() => toggleDarkTheme()}
                sx={{ p: 0 }}
              >
                {mode === "dark" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
