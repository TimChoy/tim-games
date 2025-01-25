import { NextResponse } from "next/server";
import { getPusherInstance } from "@/libs/pusher/server";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  const { token, playerMove, id } = await req.json();
  try {
    await pusherServer.trigger(`private-${token}`, "tictactoe-start", {
      playerMove: playerMove,
      id: id,
    });

    return NextResponse.json({ message: "Game Initialized" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in socket", error: error },
      { status: 500 }
    );
  }
}
