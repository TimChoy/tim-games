"use client";
import React from "react";
import styles from "@/styles/Homepage.module.css";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import GameCard from "./GameCard";
import { IGameCardProps } from "@/types/types";

const gameList: IGameCardProps[] = [
  { title: "Infinite TicTacToe", href: "/infinite-tictactoe" },
  { title: "Minesweeper", href: "/minesweeper" },
  { title: "Game 3", href: "/" },
];

export default function Homepage() {
  return (
    <div className={styles.homepageContainer}>
      <Box className={styles.homepage} sx={{ flexGrow: 1 }}>
        <Typography variant="h2" gutterBottom>
          Some Fun Games? Idk enjoy though
        </Typography>
        <Grid
          container
          spacing={2}
          columns={{ xs: 1, sm: 2, md: 4 }}
          sx={{ width: "80vw" }}
        >
          {gameList.map((data, index) => (
            <Grid key={index} size={1}>
              <GameCard {...data} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
