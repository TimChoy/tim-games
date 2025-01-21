"use client";

import React from "react";
import { Card, CardContent, CardActionArea, Typography } from "@mui/material";
import { IGameCardProps } from "@/types/types";
import Link from "next/link";

const handleCardClick = (props: IGameCardProps) => {
  console.log(props);
};

export default function GameCard(props: IGameCardProps) {
  return (
    <Card raised>
      <CardActionArea
        LinkComponent={Link}
        href={props.href}
        onClick={() => handleCardClick(props)}
        sx={{
          height: "100%",
          "&:hover": { backgroundColor: "action.selectedHover" },
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {props.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
