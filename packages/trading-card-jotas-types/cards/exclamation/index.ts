import type { CardType, PlayerType } from "../types";

const Card: CardType = {
  label: "!",
  value: null,
  limit: 2,
  operation: ".",
  desc: "Troca essa carta com a carta jogada na outra pilha.",
  priority: 2,
  effect: (cardOwner: PlayerType, otherPlayer: PlayerType) => {
    const lastCastingPlayerCard = cardOwner.stack.cards.splice(-1, 1);
    const lastOtherPlayerCard = otherPlayer.stack.cards.splice(-1, 1);

    if (
      lastCastingPlayerCard.length === 1 &&
      lastOtherPlayerCard.length === 1
    ) {
      cardOwner.stack.cards.push(lastOtherPlayerCard[0]);
      otherPlayer.stack.cards.push(lastCastingPlayerCard[0]);
    }
  },
};

export default Card;
