import { wrapRoute } from "../types";
import * as cards from "@/cards";

export const getCardImage = wrapRoute<{ cardName: string }>(
  "cardImage",
  (req, res) => {
    const cardName = req.params.cardName.split(".")[0];
    return res.sendFile(
      `/${cardName}/${cardName}.png`,
      { root: "src/cards" },
      (err) => res.status(404).send(err)
    );
  }
);
getCardImage.route = { params: ["cardName"], method: "get" };

export const getVisualEffects = wrapRoute<{ effectName: string }>(
  "visualEffects",
  (req, res) => {
    const effectName = req.params.effectName.split(".")[0];
    return res.sendFile(
      `/${effectName}/${effectName}.png`,
      { root: "src/visualEffects" },
      (err) => res.status(404).send(err)
    );
  }
);

getVisualEffects.route = { params: ["effectName"], method: "get" };

export const getCards = wrapRoute("cards", (req, res) => {
  const result = Object.entries(cards).map(
    ([cardKey, { default: cardData }]) => {
      const { effect, ...cardProps } = cardData;
      return {
        key: cardKey,
        src: `/cardImage/${cardKey}.png`,
        ...cardProps,
      };
    }
  );
  return res.send(result);
});

getCards.route = { params: [], method: "get" };
