import type { ConnectedSocket, UserData } from "@/states/socket";
import { DeckCard } from "../../../trading-card-jotas-types/cards/types";

export const initialUserData: UserData = {
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
): UserData & Pick<ConnectedSocket, "send"> => ({
  ...initialUserData,
  ingameDeck: deck,
  stance: "attack",
  room,
  deck,
  send: () => {},
});
