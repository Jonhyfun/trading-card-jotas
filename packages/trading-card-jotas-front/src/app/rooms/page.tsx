import { serverDataFetch } from "@/utils/server";
import { RoomsClient } from "./client";

export default async function RoomsPage() {
  const initialRooms =
    await serverDataFetch<{ playerCount: number; room: string }[]>("rooms");
  return <RoomsClient initialRooms={initialRooms} />;
}
