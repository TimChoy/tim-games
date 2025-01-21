"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import styles from "@/styles/InfiniteTicTacToe.module.css";

export default function InfiniteTicTacToe() {
  return (
    <div className={styles.tictactoeContainer}>
      <Box className={styles.tictactoe} sx={{ flexGrow: 1 }}>
        <Typography variant="h2" gutterBottom>
          Infinite TicTacToe
        </Typography>
        <Grid
          container
          columns={3}
          spacing={0}
          sx={{
            "--Grid-borderWidth": "2px",
            borderTop: "var(--Grid-borderWidth) solid",
            borderLeft: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
            "& > div": {
              borderRight: "var(--Grid-borderWidth) solid",
              borderBottom: "var(--Grid-borderWidth) solid",
              borderColor: "divider",
            },
            maxWidth: "306px",
          }}
        >
          {Array.from(Array(9)).map((_, index) => (
            <Grid
              key={index}
              size={1}
              minHeight={100}
              minWidth={100}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {index + 1}
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
