import { PrismaQuery } from "@/providers/prisma";
import { wrapRoute } from "../types";
import { Cards } from "@/cards/types";

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
