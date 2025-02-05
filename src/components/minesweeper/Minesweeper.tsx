"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Minesweeper.module.css";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const cellSize = 30;

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [running, setRunning] = useState<boolean>(false);

  // Variables for game board
  const [width, setWidth] = useState<number>(5);
  const [height, setHeight] = useState<number>(5);
  const [mines, setMines] = useState<number>(10);

  // Variables for custom difficulty
  const [maxMines, setMaxMines] = useState<number>(0);
  const [customWidth, setCustomWidth] = useState<number>(5);
  const [customHeight, setCustomHeight] = useState<number>(5);
  const [customMines, setCustomMines] = useState<number>(10);

  useEffect(() => {
    if (customWidth != null && customHeight != null) {
      setMaxMines(() => customWidth * customHeight - 1);
    }
  }, [customWidth, customHeight]);

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDifficulty(() => (e.target as HTMLInputElement).value);
  };

  // Helper function for modifying input to make it in range
  const validDimensions = (value: string) => {
    const dimension = value == "" ? 2 : parseInt(value);

    if (dimension < 2) {
      return 2;
    }
    if (dimension > 99) {
      return 99;
    }
    return dimension;
  };

  const validMines = (value: string) => {
    const mines = value == "" ? 1 : parseInt(value);
    if (mines < 1) {
      return 1;
    }
    if (mines > maxMines) {
      return maxMines;
    }
    return mines;
  };

  const handleGameStart = () => {
    switch (difficulty) {
      case "easy":
        initGame(9, 9, 10);
        break;
      case "medium":
        initGame(16, 16, 40);
        break;
      case "hard":
        initGame(16, 30, 99);
        break;
      case "custom":
        initGame(customWidth, customHeight, customMines);
        break;
      default:
        console.error("Unreachable");
        break;
    }
  };

  const initGame = (w: number, h: number, m: number) => {
    setWidth(() => w);
    setHeight(() => h);
    setMines(() => m);
    setRunning(() => true);
  };

  return (
    <div className={styles.minesweeperContainer}>
      <Box className={styles.minesweeper} sx={{ flexGrow: 1 }}>
        <Typography variant="h2" gutterBottom>
          Minesweeper
        </Typography>
        {!running ? (
          <>
            <FormControl>
              <Typography variant="body1">Difficulty</Typography>
              <RadioGroup
                row
                name="radio-buttons-group"
                value={difficulty}
                onChange={handleDifficultyChange}
              >
                <FormControlLabel
                  value="easy"
                  control={<Radio />}
                  label="Easy"
                />
                <FormControlLabel
                  value="medium"
                  control={<Radio />}
                  label="Medium"
                />
                <FormControlLabel
                  value="hard"
                  control={<Radio />}
                  label="Hard"
                />
                <FormControlLabel
                  value="custom"
                  control={<Radio />}
                  label="Custom"
                />
              </RadioGroup>
            </FormControl>
            {difficulty === "custom" ? (
              <Box sx={{ marginTop: "1rem" }}>
                <TextField
                  label="Width (2 - 99)"
                  id="custom-difficulty-input-width"
                  value={customWidth}
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCustomWidth(() => validDimensions(e.target.value));
                  }}
                />
                <TextField
                  label="Height (2 - 99)"
                  id="custom-difficulty-input-height"
                  value={customHeight}
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCustomHeight(() => validDimensions(e.target.value));
                  }}
                />
                <TextField
                  label="Number of Mines"
                  id="custom-difficulty-input-mines"
                  value={customMines}
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCustomMines(() => validMines(e.target.value));
                  }}
                />
              </Box>
            ) : (
              // Render nothing if custom is not selected
              <></>
            )}
            <Button
              variant="outlined"
              sx={{ marginTop: "1rem" }}
              onClick={handleGameStart}
            >
              Start Game
            </Button>
          </>
        ) : (
          <>
            <Typography
              variant="body2"
              gutterBottom
            >{`Mines remaining: ${mines}`}</Typography>
            <Grid
              container
              columns={width}
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
                maxWidth: `${cellSize * width + 2}px`,
              }}
            >
              {Array.from(Array(width * height).keys()).map((_, index) => (
                <Grid
                  key={index}
                  size={1}
                  height={cellSize}
                  width={cellSize}
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
                    <CardActionArea sx={{ width: "100%", height: "100%" }}>
                      <CardContent>{""}</CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </div>
  );
}
