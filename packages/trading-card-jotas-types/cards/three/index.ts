import { UserData } from "../../../trading-card-jotas-server/src/initializers/webSocket";
import { CardData } from "../types";

const cardData: CardData = {
  label: "3",
  value: 3,
  limit: 3,
  desc: "Essa carta vale 3.",
  effect: (castingPlayer: UserData, otherPlayer: UserData) => {},
};

export default cardData;
