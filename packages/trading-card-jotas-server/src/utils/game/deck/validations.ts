import type { Cards } from "trading-card-jotas-types/cards/types";
import * as cards from "trading-card-jotas-types/cards";

export function validDeck(deck?: Cards[]) {
  //TODO return reason?
  if (!deck || deck.length !== 20) return false;

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
