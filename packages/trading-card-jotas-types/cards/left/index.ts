import * as CardsObject from "..";
import type { CardType, PlayerType } from "../../types";

const Card: CardType = {
  label: "<",
  value: null,
  limit: 2,
  ghost: true,
  desc: "Puxa a operação mais próxima para antes dessa carta.",
  effect: (cardOwner: PlayerType) => {
    if (cardOwner.stack.cards.length === 1) return;

    let lastOperation = -1;
    for (let i = cardOwner.stack.cards.length - 1; i >= 0; i--) {
      if (
        CardsObject[cardOwner.stack.cards[i].cardKey].default.operation &&
        CardsObject[cardOwner.stack.cards[i].cardKey].default.operation !== "."
      ) {
        lastOperation = i;
        break;
      }
    }

    if (lastOperation === -1) return;

    const movedCard = cardOwner.stack.cards.splice(lastOperation, 1)[0];
    const newIndex = cardOwner.stack.cards.length - 1;
    cardOwner.stack.cards.splice(newIndex, 0, movedCard);
  },
};

export default Card;
