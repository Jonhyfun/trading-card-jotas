import { cookies } from "next/headers";
import { Game } from "./client";
import { redirect } from "next/navigation";

export default async function GamePage(
  props: {
    params: Promise<{ gameId: string }>;
  }
) {
  const params = await props.params;
  const cookieStore = await cookies();

  if (!cookieStore.get("token") || !params.gameId) return redirect("/");

  const joinRoomResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/joinRoom/${params.gameId}`,
    {
      headers: new Headers({
        Authorization: "Bearer " + cookieStore.get("token")?.value,
      }),
    }
  );

  const response = await joinRoomResponse.json();
  if (response && response.success) {
    return <Game gameId={params.gameId} />;
  }

  return redirect("/");
}
