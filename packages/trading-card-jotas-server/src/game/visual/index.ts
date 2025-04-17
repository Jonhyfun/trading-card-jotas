import type { CardData } from "trading-card-jotas-types/cards/types";
import { Player } from "@/models/player";

export const handleVisualEffects = (player: Player, stack: CardData[]) => {
  stack.forEach((deckCard, i) => {
    if (deckCard.operation && deckCard.operation !== ".") {
      const previousCard = stack[i - 1];
      const nextCard = stack[i + 1];

      if (
        (nextCard && nextCard.operation) ||
        !previousCard ||
        (previousCard && previousCard.operation === ".")
      ) {
        player.cardVisualEffects[i] = "overwritten";
      }
    }
  });
};
