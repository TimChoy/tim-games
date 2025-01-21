"use client";
import React from "react";
import styles from "@/styles/Homepage.module.css";
import { Box, Paper, styled, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import GameCard from "./GameCard";
import { IGameCardProps } from "@/common/types";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const gameList: IGameCardProps[] = [
  { title: "Infinite TicTacToe", href: "/" },
  { title: "Infinite TicTacToe", href: "/" },
  { title: "Infinite TicTacToe", href: "/" },
];

export default function Homepage() {
  return (
    <div className={styles.homepageContainer}>
      <Box className={styles.homepage} sx={{ flexGrow: 1 }}>
        <Typography variant="h2" gutterBottom>
          Some Fun Games? Idk they're not tested.
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
