import type { CardType, PlayerType } from "../types";

const Card: CardType = {
  label: "&",
  value: 2,
  limit: 2,
  operation: ".",
  desc: "Essa carta anda duas casas para trás.",
  effect: (pileOwner: PlayerType) => {
    const cards = pileOwner.stack.cards.splice(-3);
    const and = cards.splice(-1);
    pileOwner.stack.cards.push(...[...and, ...cards]);
  },
};

export default Card;
