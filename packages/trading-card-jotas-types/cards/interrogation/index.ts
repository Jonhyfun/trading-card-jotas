import * as CardsObject from "..";
import type { CardType, PlayerType } from "../types";

const Card: CardType = {
  label: "?",
  value: null,
  limit: 2,
  desc: "Essa carta se transforma em uma carta aleatória da pilha que ela foi colocada.",
  effect: (cardOwner: PlayerType, otherPlayer: PlayerType) => {
    if (cardOwner.stack.cards.length <= 1) return;

    cardOwner.stack.cards.splice(-1);
    cardOwner.stack.cards.push(
      cardOwner.stack.cards[
        Math.floor(Math.random() * cardOwner.stack.cards.length)
      ]
    );

    cardOwner.stack.visualEffects[
      cardOwner.stack.cards[cardOwner.stack.cards.length - 1].id
    ] = "copied";

    const copiedCard =
      CardsObject[cardOwner.stack.cards.slice(-1)[0].cardKey].default;
    if (copiedCard.label !== Card.label) {
      copiedCard.effect(cardOwner, otherPlayer);
    }
  },
};

export default Card;
