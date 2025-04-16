import { UserData } from "../../../trading-card-jotas-server/src/initializers/webSocket";
import { CardData } from "../types";

const cardData: CardData = {
  label: "/",
  value: null,
  operation: "/",
  desc: "Divide o número anterior com a próxima carta numérica.",
  limit: 2,
  effect: (castingPlayer: UserData, otherPlayer: UserData) => {},
};

export default cardData;
