import { UserData } from "../../../trading-card-jotas-server/src/initializers/webSocket";
import { CardData } from "../types";

const cardData: CardData = {
  label: "2",
  value: 2,
  limit: 3,
  desc: "Essa carta vale 2.",
  effect: (castingPlayer: UserData, otherPlayer: UserData) => {},
};

export default cardData;
