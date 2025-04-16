import { wrapRoute } from "../types";
import { withAuthorization } from "../middlewares";
import { makeId } from "@/utils/random";
import { Cards } from "trading-card-jotas-types/cards/types";

export const postSetDeck = wrapRoute("setDeck", async (req, res, close) => {
  withAuthorization(req, res, close, (user, socket) => {
    const selectedCards = req.body as Cards[];
    if (!socket.hand || socket.hand?.length === 0) {
      if (selectedCards && selectedCards.length) {
        socket.deck = [];
        selectedCards.forEach((cardKey, i) => {
          socket.deck.push({ cardKey, id: `${i}-${makeId(8)}` });
        });
        console.log(`${socket.uid} salvou o deck`);
        return { success: true }; //TODO não ta retornando isso aqui
      }
    }
    res.status(400).json({ error: "Invalid socket connection" });
    close();
  });
});

postSetDeck.route = { params: [], method: "post" };
