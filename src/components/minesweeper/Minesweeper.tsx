"use client";
import React from "react";
import styles from "@/styles/Minesweeper.module.css";
import { Box, Typography } from "@mui/material";

export default function Minesweeper() {
  return (
    <div className={styles.minesweeperContainer}>
      <Box className={styles.minesweeper} sx={{ flexGrow: 1 }}>
        <Typography variant="h2" gutterBottom>
          Minesweeper
        </Typography>
      </Box>
    </div>
  );
}
