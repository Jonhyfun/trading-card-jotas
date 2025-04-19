import type { BackendCard } from "@/hooks/useCards";
import type { Cards } from "trading-card-jotas-types";
import { DeckClient } from "./client";
import { serverDataFetch } from "@/utils/server";

export default async function DeckEditorPage() {
  const [cards, { cards: deck }] = await Promise.all([
    serverDataFetch<BackendCard[]>("cards"),
    serverDataFetch<{ cards: Cards[] }>("deck"),
  ]);
  return <DeckClient cards={cards} deck={deck} />;
}
