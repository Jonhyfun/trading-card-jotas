import type { Cards } from "trading-card-jotas-types/cards/types";
import * as cards from "trading-card-jotas-types/cards";
import prisma from "@/providers/prisma";
import { DECK_SIZE } from "trading-card-jotas-types/consts";
import { wrapRoute } from "../types";
import { withAuthorization } from "../middlewares";

export const saveDeck = wrapRoute("saveDeck", (req, res, close) =>
  withAuthorization(req, res, close, async (user, socket) => {
    const deck = req.body as Cards[];

    if (!deck || deck.length !== DECK_SIZE) {
      res.status(400).send({ error: "Invalid deck size!" });
      close();
      return;
    }

    for (const cardKey of [...new Set(deck)]) {
      if (!cards[cardKey]) {
        res.status(400).send({ error: "Invalid deck cards!" });
        close();
        return;
      }
    }

    try {
      await prisma.deck.upsert({
        where: {
          userFirebaseId: socket.uid,
        },
        create: {
          userFirebaseId: socket.uid,
          cards: deck,
        },
        update: {
          cards: deck,
        },
      });
      res.status(201).send({ success: "Deck salvo com sucesso!" });
    } catch {
      res.status(400).send({ error: "Invalid deck!" });
    }
    close();
    return;
  })
);

saveDeck.route = { params: [], method: "post" };
