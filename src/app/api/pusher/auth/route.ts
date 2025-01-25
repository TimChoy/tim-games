import { getPusherInstance } from "@/libs/pusher/server";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  console.log("Authenticating pusher perms...");
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // Check user perms
  const authResponse = pusherServer.authorizeChannel(socketId, channelName);

  return new Response(JSON.stringify(authResponse));
}
