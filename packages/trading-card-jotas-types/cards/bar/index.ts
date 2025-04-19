import * as CardsObject from "..";
import type { CardType, PlayerType } from "../../types";

const Card: CardType = {
  label: "|",
  value: null,
  limit: 2,
  desc: "Essa carta se transforma na carta que o seu oponente jogou.",
  effect: (cardOwner: PlayerType, otherPlayer: PlayerType) => {
    cardOwner.stack.cards.splice(-1);
    cardOwner.stack.cards.push(otherPlayer.stack.cards.slice(-1)[0]);

    cardOwner.stack.visualEffects[
      cardOwner.stack.cards[cardOwner.stack.cards.length - 1].id
    ] = "copied";

    const copiedCard =
      CardsObject[otherPlayer.stack.cards.slice(-1)[0].cardKey].default;
    if (copiedCard.label !== Card.label) {
      copiedCard.effect(cardOwner, otherPlayer);
    }
  },
};

export default Card;
