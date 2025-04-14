import type { ConnectedSocket } from "@/states/socket";
import type { Cards, DeckCard } from "../cards/types";
import { onUserSetCard } from "../game";
import { makeId, shuffle } from "../utils/random";

const baseSetCurrentDeck = (ws: ConnectedSocket, payload: string) => {
  if (!ws.hand || ws.hand?.length === 0) {
    const selectedCards = JSON.parse(payload) as Cards[];
    if (selectedCards && selectedCards.length) {
      ws.deck = [];
      selectedCards.forEach((cardKey, i) => {
        ws.deck.push({ cardKey, id: `${i}-${makeId(8)}` });
      });
      console.log(`${ws.uid} salvou o deck`);
      return true;
    }
  }
  return false;
};

export const setCurrentDeck = baseSetCurrentDeck;

export const setCurrentDeckWithMessage = (
  ws: ConnectedSocket,
  payload: string
) => {
  if (baseSetCurrentDeck(ws, payload)) {
    ws.send("success/Deck salvo com sucesso!");
  }
};

export const setCard = (ws: ConnectedSocket, payload: [DeckCard["id"]]) => {
  const pickedCardIndex = ws.hand.findIndex(({ id }) => payload[0] === id);
  if (pickedCardIndex > -1) {
    const pickedCard = ws.hand.splice(pickedCardIndex, 1)[0];
    if (pickedCard) {
      onUserSetCard(ws, pickedCard);
      ws.send(`loadHand/${JSON.stringify(ws.hand)}`);
    }
  }
};

export const fetchHand = (ws: ConnectedSocket) => {
  if (ws.hand && ws.deck?.length && ws.hand.length === 0) {
    console.log("fetchou");
    ws.ingameDeck = ws.deck;
    shuffle(ws.ingameDeck);
    ws.hand = ws.ingameDeck.splice(0, 5);
  }
  ws.send(`loadHand/${JSON.stringify(ws.hand)}`);
};
