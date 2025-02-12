"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/Minesweeper.module.css";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MinesweeperGen } from "@/utils/MinesweeperGen";
import { Queue } from "@/types/Queue";

const CELL_SIZE = 40;

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [running, setRunning] = useState<boolean>(false);
  const [gameEnd, setGameEnd] = useState<boolean>(false);
  const [victory, setVictory] = useState<boolean>(false);
  const [board, setBoard] = useState<number[][]>([]);
  const [seen, setSeen] = useState<boolean[][]>([]);
  const [flagCount, setFlagCount] = useState<number>(0);
  const [flag, setFlag] = useState<number[][]>([]);

  // Variables for game board
  const [width, setWidth] = useState<number>(5);
  const [height, setHeight] = useState<number>(5);
  const [mines, setMines] = useState<number>(10);

  // Variables for custom difficulty
  const [maxMines, setMaxMines] = useState<number>(0);
  const [customWidth, setCustomWidth] = useState<number>(5);
  const [customHeight, setCustomHeight] = useState<number>(5);
  const [customMines, setCustomMines] = useState<number>(10);

  // Variables for timer
  const [time, setTime] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const startTimeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  const startTimer = () => {
    startTimeRef.current = Date.now() - time * 100;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    setTimerRunning(() => true);
  };

  const resetTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    setTime(() => 0);
    setTimerRunning(() => false);
  };

  useEffect(() => {
    if (timerRunning) {
      startTimer();
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerRunning]);

  const generateTimeString = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${minutes == 0 ? "" : minutes + "m"} ${seconds}s`;
  };

  useEffect(() => {
    if (customWidth != null && customHeight != null) {
      setMaxMines(() => customWidth * customHeight - 1);
    }
  }, [customWidth, customHeight]);

  // Check victory condition
  useEffect(() => {
    if (mines == flagCount) {
      console.log("Max mine count");
      if (flag.every((item) => board[item[0]][item[1]] === 9)) {
        console.log("Game over: player wins");
        setGameEnd(() => true);
        setVictory(() => true);
        // End timer
        setTimerRunning(() => false);
      }
    }
  }, [mines, flagCount, board, flag]);

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

  const handleNewGame = () => {
    setRunning(() => false);
    resetTimer();
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
    setBoard(() => MinesweeperGen(w, h, m));
    // Initialize seen array for board
    const initSeenArray = Array.from(Array(h)).map(() => Array(w).fill(false));
    setSeen(() => [...initSeenArray]);
    setFlagCount(() => 0);
    setFlag(() => []);
    setRunning(() => true);
    setGameEnd(() => false);
    setVictory(() => false);

    // Start timer
    startTimer();
  };

  const contains = (arr: number[][], row: number, col: number) => {
    return arr.some((item) => {
      return item[0] === row && item[1] === col;
    });
  };

  const handleCellClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: number,
    col: number
  ) => {
    if (event.button === 2) {
      // Right mouse button
      event.preventDefault();
      // Increment count if flag is added, otherwise decrement
      if (!contains(flag, row, col)) {
        setFlagCount((flagCount) => flagCount + 1);
        setFlag((flag) => [...flag, [row, col]]);
      } else {
        setFlagCount((flagCount) => flagCount - 1);
        setFlag((flag) =>
          flag.filter((item) => {
            return item[0] !== row || item[1] !== col;
          })
        );
      }
    } else {
      // Left mouse button
      // Ignore click if flag is at the location
      if (contains(flag, row, col)) {
        return;
      }

      const tempSeen = [...seen];
      tempSeen[row][col] = true;
      // If cell is a mine, end game
      if (board[row][col] == 9) {
        setGameEnd(() => true);
        // End timer
        setTimerRunning(() => false);
        return;
      }

      // If seen had no nearby mines, reveal neighbours recursively
      if (board[row][col] == 0) {
        const q = new Queue<[number, number]>();
        q.enqueue([row, col]);
        while (q.size() > 0) {
          const cell = q.dequeue();
          if (cell != undefined) {
            const neighbours = [
              [cell[0] - 1, cell[1] - 1],
              [cell[0] - 1, cell[1]],
              [cell[0] - 1, cell[1] + 1],
              [cell[0], cell[1] - 1],
              [cell[0], cell[1] + 1],
              [cell[0] + 1, cell[1] - 1],
              [cell[0] + 1, cell[1]],
              [cell[0] + 1, cell[1] + 1],
            ];
            neighbours.forEach((n) => {
              if (
                0 <= n[0] &&
                n[0] < height &&
                0 <= n[1] &&
                n[1] < width &&
                !tempSeen[n[0]][n[1]] &&
                !contains(flag, n[0], n[1])
              ) {
                tempSeen[n[0]][n[1]] = true;
                if (board[n[0]][n[1]] == 0) {
                  q.enqueue([n[0], n[1]]);
                }
              }
            });
          }
        }
      }
      setSeen(() => tempSeen);
    }
  };

  const cellContent = (row: number, col: number, cell: number) => {
    // Override if game end (show all)
    if (gameEnd) {
      return cell === 9 ? cell : "";
    }

    if (contains(flag, row, col)) {
      return "F";
    }
    if (seen[row][col]) {
      switch (cell) {
        case 9:
          // Bomb
          return "*";
        case 0:
          // Empty
          return "";
        default:
          return cell;
      }
    }
    return "";
  };

  return (
    <div className={styles.minesweeperContainer}>
      <Box className={styles.minesweeper} sx={{ flexGrow: 1 }}>
        <Typography variant="h2" gutterBottom>
          Minesweeper
        </Typography>
        <Typography variant="body1" gutterBottom>
          {gameEnd
            ? victory
              ? "Congratulations, you win!"
              : "Unfortunately you lost."
            : ""}
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
                  disabled // TODO
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
            <Typography variant="body2" gutterBottom>
              {`Mines remaining: ${
                mines - flagCount
              }. Time Elapsed: ${generateTimeString()}`}
            </Typography>
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
                maxWidth: `${CELL_SIZE * width + 2}px`,
                marginBottom: "2rem",
              }}
            >
              {board.map((data, row) =>
                data.map((cell, col) => (
                  <Grid
                    key={`${row}${col}`}
                    size={1}
                    height={CELL_SIZE}
                    width={CELL_SIZE}
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
                      <CardActionArea
                        sx={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: seen[row][col] ? "grey" : "",
                        }}
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                          handleCellClick(event, row, col)
                        }
                        onContextMenu={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => handleCellClick(event, row, col)}
                        disabled={gameEnd || seen[row][col]}
                      >
                        <CardContent
                          sx={{
                            color:
                              contains(flag, row, col) ||
                              (gameEnd && cell === 9)
                                ? "red"
                                : "black",
                          }}
                        >
                          {cellContent(row, col, cell)}
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
            {/* New Game button */}
            {gameEnd ? (
              <Button
                variant="outlined"
                sx={{ marginTop: "1rem" }}
                onClick={handleNewGame}
              >
                New Game
              </Button>
            ) : (
              <></>
            )}
          </>
        )}
      </Box>
    </div>
  );
}
