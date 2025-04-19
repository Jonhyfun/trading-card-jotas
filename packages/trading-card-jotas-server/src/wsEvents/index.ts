import type { ConnectedSocket } from "@/states/socket";
import type { DeckCard } from "trading-card-jotas-types/cards";

export const setCard = (ws: ConnectedSocket, payload: DeckCard["id"]) => {
  const { player } = ws;
  player.placeCard(payload);
};
