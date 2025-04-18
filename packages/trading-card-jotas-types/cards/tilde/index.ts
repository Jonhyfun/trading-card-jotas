import type { CardType } from "../types";

const Card: CardType = {
  label: "~",
  value: null,
  limit: 2,
  desc: "Inverte o sinal da carta anterior.",
  modifyPreviousCard: (card: CardType) => {
    return { ...card, value: card.value ? card.value * -1 : card.value };
  },
  effect: () => {},
};

export default Card;
