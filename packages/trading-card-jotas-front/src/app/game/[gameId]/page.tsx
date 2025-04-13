import { cookies } from "next/headers";
import { Game } from "./client";
import { redirect } from "next/navigation";

export default async function GamePage() {
  const cookieStore = await cookies();

  if (!cookieStore.get("token")) return redirect("/");

  const tokenResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/currentSocket`,
    {
      headers: new Headers({
        Authorization: "Bearer " + cookieStore.get("token")?.value,
      }),
    }
  );

  const token = await tokenResponse.text();
  return <>{token}</>;

  return <Game />;
}
