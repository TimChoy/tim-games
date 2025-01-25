import { NextResponse } from "next/server";
import { getPusherInstance } from "@/libs/pusher/server";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  const { token, board, turn, winner } = await req.json();
  try {
    await pusherServer.trigger(`private-${token}`, "tictactoe-move", {
      gameBoard: board,
      turn: turn,
      winner: winner,
    });

    return NextResponse.json({ message: board }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in socket", error: error },
      { status: 500 }
    );
  }
}
