import type { CardType, PlayerType } from "../types";

const Card: CardType = {
  label: "#",
  value: -2,
  limit: 3,
  desc: "No próximo turno você e seu oponente continuam na mesma pilha (essa carta vale -2 pontos).",
  effect: (cardOwner: PlayerType, otherPlayer: PlayerType) => {
    cardOwner.effects.push("keepStance");
    otherPlayer.effects.push("keepStance");
  },
};

export default Card;
