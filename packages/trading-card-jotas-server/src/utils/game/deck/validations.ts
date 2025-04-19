import type { Cards } from "trading-card-jotas-types";
import { DECK_SIZE } from "trading-card-jotas-types/consts";
import { cards } from "trading-card-jotas-types";

export function validDeck(deck?: Cards[]) {
  //TODO return reason?
  if (!deck || deck.length !== DECK_SIZE) return false;

  const uniqueCards = [...new Set(deck)];

  for (const uniqueCard of uniqueCards) {
    if (!cards[uniqueCard]) return false;
    if (
      deck.filter((card) => uniqueCard === card).length >
      cards[uniqueCard].default.limit
    ) {
      return false;
    }
  }

  return true;
}
