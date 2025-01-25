"use client";
import React, { useEffect, useState } from "react";
import { pusherClient } from "@/libs/pusher/client";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import styles from "@/styles/InfiniteTicTacToe.module.css";
import { Visibility, VisibilityOff, Casino } from "@mui/icons-material";

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

const initGameBoard: { state: string; age: number | null }[] = [
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
  const [running, setRunning] = useState<boolean>(false);
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [turn, setTurn] = useState<number>(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameBoard, setGameBoard] = useState<
    { state: string; age: number | null }[]
  >(JSON.parse(JSON.stringify(initGameBoard)));

  // Pusher channels
  const [token, setToken] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [playerMove, setPlayerMove] = useState<string | null>(null);

  // Form states
  const [showToken, setShowToken] = useState<boolean>(true);

  // On render, generate client's id
  useEffect(() => {
    const randId = Math.random().toString(36).substring(5, 10);
    console.log("Client id:", randId);
    setPlayerId(() => randId);
  }, []);

  // Pusher listener
  useEffect(() => {
    if (token.length == 10) {
      const channel = pusherClient.subscribe(`private-${token}`);

      // Listen to events
      channel.bind("tictactoe-start", (data: any) => {
        console.log(data.id, playerId);
        if (data.id != playerId) {
          const otherMove = data.playerMove == "X" ? "O" : "X";
          initGameState(otherMove);
        }
      });

      channel.bind("tictactoe-move", (data: any) => {
        setGameBoard(() => data.gameBoard);
        setTurn(() => data.turn + 1);
        setWinner(() => data.winner);

        if (data.winner) {
          setRunning(() => false);
        }
      });

      return () => {
        channel.unbind_all();
        pusherClient.unsubscribe(`private-${token}`);
      };
    }

    return () => {
      pusherClient.unsubscribe(`private-${token}`);
    };
  }, [token, playerId]);

  const handleGameStartPOST = async (playerMove: string, id: string) => {
    const data = await fetch("/api/tictactoe/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        playerMove: playerMove,
        id: id,
      }),
    });
    const json = await data.json();
    console.log(json);
  };

  const handleMovePOST = async (
    board: { state: string; age: number | null }[],
    turn: number,
    winningPlayer: string | null
  ) => {
    const data = await fetch("/api/tictactoe/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        board: board,
        turn: turn,
        winner: winningPlayer,
      }),
    });
    const json = await data.json();
    console.log(json);
  };

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

    setGameBoard(() => tempBoard);

    const winningPlayer = checkGameEnd(
      index,
      turn % 2 === 0 ? "X" : "O",
      tempBoard
    );

    // Stop game if winner announced
    if (winningPlayer) {
      setRunning(() => false);
    }

    setTurn((turn) => turn + 1);

    // Only POST if token is valid
    if (token.length == 10) {
      handleMovePOST(tempBoard, turn, winningPlayer);
    }
  };

  // Helper function to set age of cells
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
    let flag = false;
    rows.forEach((row) => {
      if (
        row.includes(index) &&
        row.every((x) => {
          return board[x].state == player;
        })
      ) {
        setWinner(() => player);
        flag = true;
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
        setWinner(() => player);
        flag = true;
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
        setWinner(() => player);
        flag = true;
      }
    });

    return flag ? player : null;
  };

  // Functions for token text form
  const handleClickShowToken = () => setShowToken((show) => !show);

  const handleMouseDownToken = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpToken = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleRandomizeToken = () => {
    const randToken = Math.random().toString(36).substring(2, 12);
    setToken(() => randToken);
    setRunning(() => false);
    setPlayerMove(() => null);
  };

  // Handles start/reset of game
  const handleStartGame = () => {
    const randMove = Math.random() > 0.5 ? "X" : "O";
    handleGameStartPOST(randMove, playerId);
    initGameState(randMove);
  };

  const initGameState = (move: string) => {
    setGameBoard(() => JSON.parse(JSON.stringify(initGameBoard)));
    setTurn(() => 0);
    setWinner(() => null);
    setRunning(() => true);
    setPlayerMove(() => move);
    console.log(`You are move ${move}`);
  };

  // Handles rule modal opening
  const handleRulesOpen = () => {
    setRulesOpen(true);
  };

  const handleRulesClose = () => {
    setRulesOpen(false);
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
        <Typography variant="body2" gutterBottom>
          {playerMove
            ? `You are player ${playerMove}`
            : `You are currently not playing.`}
        </Typography>
        <FormControl variant="outlined" sx={{ marginBottom: "1rem" }}>
          <InputLabel htmlFor="outlined-game-token-controlled">
            Game Token
          </InputLabel>
          <OutlinedInput
            id="outlined-game-token-controlled"
            type={showToken ? "text" : "password"}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setToken(() => event.target.value);
              setPlayerMove(() => null);
              setRunning(() => false);
            }}
            value={token}
            title="Game Token"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showToken ? "hide token" : "show token"}
                  onClick={handleClickShowToken}
                  onMouseDown={handleMouseDownToken}
                  onMouseUp={handleMouseUpToken}
                >
                  {showToken ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <Divider orientation="vertical" />
                <IconButton
                  aria-label="Randomize token"
                  onClick={handleRandomizeToken}
                >
                  <Casino />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <ButtonGroup
          variant="outlined"
          color="inherit"
          aria-label="tictactoe-button-group"
          sx={{
            marginBottom: "2rem",
          }}
        >
          <Button onClick={handleRulesOpen}>Rules</Button>
          <Button onClick={handleStartGame} disabled={running}>
            Start Game
          </Button>
        </ButtonGroup>
        {winner != null ? (
          <Typography variant="body2" gutterBottom>
            {`Game over. ${winner} wins!`}
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
                      disabled={
                        !running || playerMove != (turn % 2 == 0 ? "X" : "O")
                      }
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
      <Modal open={rulesOpen} onClose={handleRulesClose}>
        <Box
          className={styles.modalContainer}
          sx={{ bgcolor: "background.paper", border: "2px solid #000" }}
        >
          <Typography
            id="modal-rules-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
            gutterBottom
          >
            Infinite TicTacToe Rules
          </Typography>
          <Typography id="modal-rules-body" variant="body2">
            How to play:
            <br />
            The game follows the standard rules of regular tictactoe, but after
            both players have played 3 moves, the oldest move that was played
            begins to flash. The flashing move will disappear once another move
            is made. Note that the cell that is flashing will disappear before
            the move is made, so the game doesn&apos;t end if one of the
            connections is flashing.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
