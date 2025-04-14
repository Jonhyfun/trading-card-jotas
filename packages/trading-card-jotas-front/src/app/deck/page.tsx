import { DeckClient } from "./client";
import type { BackendCard } from "@/hooks/useCards";
import { serverDataFetch } from "@/utils/server";

export default async function DeckEditorPage() {
  const cards = await serverDataFetch<BackendCard[]>("cards");
  return <DeckClient cards={cards} />;
}
