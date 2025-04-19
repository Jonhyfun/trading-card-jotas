import type { ConnectedSocket, PlayerType } from "@/states/socket";
import { DeckCard } from "trading-card-jotas-types/types";

export const initialPlayerType: PlayerType = {
  stance: "attack",
  points: [],
  cardVisualEffects: [],
  pendingEffects: [],
  globalEffects: [],
  hand: [],
  hiddenCards: [],
  cardStack: [],
  room: null,
  deck: [],
  ingameDeck: [],
};

export const getMockConnectedUser = (
  room: string,
  deck: DeckCard[]
): PlayerType & Pick<ConnectedSocket, "send"> => ({
  ...initialPlayerType,
  ingameDeck: deck,
  stance: "attack",
  room,
  deck,
  send: () => {},
});
