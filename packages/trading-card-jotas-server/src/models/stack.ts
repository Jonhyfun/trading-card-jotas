import type {
  DeckCard,
  StackType,
  VisualEffects,
} from "trading-card-jotas-types";
import { cards } from "trading-card-jotas-types";
import { Player } from "./player";

export class Stack implements StackType {
  #player: Player; //TODO possibly remove this player
  cards!: DeckCard[];
  visualEffects: Record<string, VisualEffects> = {};

  constructor(player: Player) {
    this.#player = player;
  }

  handleVisualEffects() {
    this.cards.forEach(({ cardKey, id }, i) => {
      const deckCard = cards[cardKey].default;

      if (deckCard.operation && deckCard.operation !== ".") {
        const previousCard = cards[this.cards[i - 1].cardKey].default;
        const nextCard = cards[this.cards[i + 1].cardKey].default;

        if (
          (nextCard && nextCard.operation) ||
          !previousCard ||
          (previousCard && previousCard.operation === ".")
        ) {
          this.visualEffects[id] = "overwritten";
        }
      }
    });
  }
}
