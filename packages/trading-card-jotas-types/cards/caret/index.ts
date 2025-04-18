import * as CardsObject from "..";
import type { CardType, PlayerType } from "../types";

const Card: CardType = {
  label: "^",
  ghost: true,
  value: null,
  limit: 1,
  desc: "Mova a carta anterior para trás.",
  effect: (cardOwner: PlayerType) => {
    if (cardOwner.stack.cards.length === 1) return;

    let lastNonGhostIndex = -1;
    for (let i = cardOwner.stack.cards.length - 1; i >= 0; i--) {
      if (!CardsObject[cardOwner.stack.cards[i].cardKey].default.ghost) {
        lastNonGhostIndex = i;
        break;
      }
    }

    if (lastNonGhostIndex === -1) return;

    const movedCard = cardOwner.stack.cards.splice(lastNonGhostIndex, 1)[0];
    const newIndex = lastNonGhostIndex - 1;
    cardOwner.stack.cards.splice(newIndex, 0, movedCard);
  },
};

export default Card;
