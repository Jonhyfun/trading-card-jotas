import type { CardType } from "../../types";

const Card: CardType = {
  label: "x",
  value: null,
  operation: "*",
  desc: "Multiplica o número anterior com a próxima carta.",
  limit: 2,
  effect: () => {},
};

export default Card;
