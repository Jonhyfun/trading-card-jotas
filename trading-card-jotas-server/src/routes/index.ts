import { Cards } from "../cards/types";
import { wrapRoute } from "./types";
import * as cards from "../cards";
import { getRooms } from "..";
import { PrismaQuery } from "../providers/prisma";

export const postExample = wrapRoute("example", (req, res) => {
  return res.send("user posted");
});

postExample.route = { params: [], method: "post" };

export const getRoomsRoute = wrapRoute("roomsRoute", (req, res) => {
  return res.send(
    Object.entries(getRooms()).map(([key, players]) => ({
      room: key,
      playerCount: players.length,
    }))
  );
});

getRoomsRoute.route = { params: [], method: "get" };

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

export const postSetDeck = wrapRoute("setDeck", async (req, res) => {
  const cards = req.body.cards as Cards[];
  const uid = ""; // TODO: get the uid

  await PrismaQuery(async (prisma) => {
    const deck = await prisma.deck.create({
      data: {
        userFirebaseId: uid,
        cards: {
          createMany: {
            data: [
              {
                id: "carta-mucho-loka", // TODO: update card ID
              },
            ],
          },
        },
      },
    });
  });

  return res.send("OK");
});

postSetDeck.route = { params: [], method: "post" };
