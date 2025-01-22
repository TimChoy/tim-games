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

const rows = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

const cols = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const diags = [
  [0, 4, 8],
  [2, 4, 6],
];

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
  const [winner, setWinner] = useState<string | null>(null);
  const [gameBoard, setGameBoard] = useState(initGameState);

  const handleGameTurn = (index: number) => {
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
    checkGameEnd(index, turn % 2 === 0 ? "X" : "O", tempBoard);
    setTurn(turn + 1);
  };

  const handleAge = (board: { state: string; age: number | null }[]) => {
    board = board.map((cell) =>
      cell.age && cell.age <= turn ? { state: "", age: null } : cell
    );
    return board;
  };

  const checkGameEnd = (
    index: number,
    player: string,
    board: { state: string; age: number | null }[]
  ) => {
    // We just need to check the row/col/diagonal of the current index
    // Check rows
    rows.forEach((row) => {
      if (
        row.includes(index) &&
        row.every((x) => {
          return board[x].state == player;
        })
      ) {
        setWinner(player);
      }
    });

    // Check cols
    cols.forEach((col) => {
      if (
        col.includes(index) &&
        col.every((x) => {
          return board[x].state == player;
        })
      ) {
        setWinner(player);
      }
    });

    // Check diagonals
    diags.forEach((diag) => {
      if (
        diag.includes(index) &&
        diag.every((x) => {
          return board[x].state == player;
        })
      ) {
        setWinner(player);
      }
    });
  };

  return (
    <div className={styles.tictactoeContainer}>
      <Box className={styles.tictactoe} sx={{ flexGrow: 1 }}>
        <Typography variant="h2" gutterBottom>
          Infinite TicTacToe
        </Typography>
        <Typography variant="body2" gutterBottom>
          {`Turn: ${Math.floor(turn / 2) + 1} Move: ${
            turn % 2 == 0 ? "X" : "O"
          }`}
        </Typography>
        {winner != null ? (
          <Typography variant="body2" gutterBottom>
            {`Game over. ${winner} wins!` }
          </Typography>
        ) : (
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
        )}
      </Box>
    </div>
  );
}
