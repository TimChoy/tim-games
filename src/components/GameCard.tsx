"use client";

import React from "react";
import { Card, CardContent, CardActionArea, Typography } from "@mui/material";
import { IGameCardProps } from "@/common/types";

const handleCardClick = (props: IGameCardProps) => {
  console.log(props);
};

export default function GameCard(props: IGameCardProps) {
  return (
    <Card>
      <CardActionArea
        onClick={() => handleCardClick(props)}
        sx={{
          height: "100%",
          "&:hover": { backgroundColor: "action.selectedHover" },
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Title
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
