"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import styles from "@/styles/InfiniteTicTacToe.module.css";

const initGameState: { state: string; age: number | null }[] = [
  { state: "", age: null },
  { state: "", age: null },
  { state: "", age: null },
  { state: "", age: null },
  { state: "", age: null },
  { state: "", age: null },
  { state: "", age: null },
  { state: "", age: null },
  { state: "", age: null },
];

export default function InfiniteTicTacToe() {
  const [turn, setTurn] = useState<number>(0);
  const [gameBoard, setGameBoard] = useState(initGameState);

  const handleGameTurn = (
    index: number,
  ) => {
    console.log(turn, gameBoard);

    // Check if valid move
    let tempBoard = gameBoard;

    // Handle age
    if (turn > 2) {
      tempBoard = handleAge(tempBoard);
    }

    // Update gameState
    tempBoard[index] = {
      state: turn % 2 === 0 ? "X" : "O",
      age: turn + 6,
    };
    setGameBoard(tempBoard);
    setTurn(turn + 1);
  };

  const handleAge = (board: { state: string; age: number | null }[]) => {
    board = board.map((cell) =>
      cell.age && cell.age <= turn ? { state: "", age: null } : cell
    );
    return board;
  };

  return (
    <div className={styles.tictactoeContainer}>
      <Box className={styles.tictactoe} sx={{ flexGrow: 1 }}>
        <Typography variant="h2" gutterBottom>
          Infinite TicTacToe
        </Typography>
        <Typography variant="body2" gutterBottom>
          {`Turn: ${Math.floor(turn / 2) + 1} Move: ${turn % 2 == 0 ? 'X' : 'O'}`}
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
          {gameBoard.map((data, index) => (
            <Grid
              key={index}
              size={1}
              minHeight={100}
              minWidth={100}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {data.state === "" ? (
                  <CardActionArea
                    onClick={() => handleGameTurn(index)}
                    sx={{ width: "100%", height: "100%" }}
                  >
                    <CardContent
                      className={
                        data.age && data.age <= turn ? styles.blinking : ""
                      }
                    >
                      {data.state}
                    </CardContent>
                  </CardActionArea>
                ) : (
                  <CardContent
                    className={
                      data.age && data.age <= turn ? styles.blinking : ""
                    }
                  >
                    {data.state}
                  </CardContent>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
