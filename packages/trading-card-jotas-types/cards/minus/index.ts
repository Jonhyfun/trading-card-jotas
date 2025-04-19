import type { CardType, PlayerType } from "../../types";

const Card: CardType = {
  label: "-",
  value: null,
  limit: 2,
  effect: (castingPlayer: PlayerType) => {
    //TODO castingPlayer.effects.push("invertedOdds");
  },
};

export default Card;
