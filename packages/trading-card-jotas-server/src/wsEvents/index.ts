import type { ConnectedSocket } from "@/states/socket";
import type { DeckCard } from "trading-card-jotas-types/cards/types";
import { onUserSetCard } from "../game";

export const setCard = (ws: ConnectedSocket, payload: [DeckCard["id"]]) => {
  const { player } = ws;

  const pickedCardIndex = player.hand.findIndex(({ id }) => payload[0] === id);
  if (pickedCardIndex > -1) {
    const pickedCard = player.hand.splice(pickedCardIndex, 1)[0];
    if (pickedCard) {
      onUserSetCard(ws, pickedCard);
      ws.send(`loadHand/${JSON.stringify(player.hand)}`);
    }
  }
};

export const fetchHand = (ws: ConnectedSocket) => {
  ws.player.shuffleDeck();
};
