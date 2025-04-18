import { create, all } from "mathjs";
import { Player } from "./player";
import * as cards from "trading-card-jotas-types/cards";

import {
  equationSanitizer,
  removeTrailingOperations,
} from "@/utils/game/sanitation";

const math = create(all);
const originalDivide = math.divide;

math.import(
  {
    divide: function (a: number, b: number) {
      if (math.isZero(a)) {
        return originalDivide(1, b);
      }
      if (math.isZero(b)) {
        return originalDivide(a, 1);
      }
      return originalDivide(a, b);
    },
  },
  { override: true }
);

export class Points {
  #player;
  #points = [0];

  constructor(player: Player) {
    this.#player = player;
  }

  calculatePoints() {
    let operation = "";
    const stackAsCards = this.#player.stack.cards.map(
      ({ cardKey }) => cards[cardKey].default
    );

    stackAsCards.forEach((deckCard, i) => {
      const nextDeckCard = stackAsCards?.[i + 1];

      if (nextDeckCard?.modifyPreviousCard) {
        if (deckCard.ghost) {
          let notGhostIndex = -1;
          for (let i = stackAsCards.length - 1; i >= 0; i--) {
            if (!stackAsCards[i].ghost) {
              notGhostIndex = i;
            }
          }
          if (notGhostIndex !== -1) {
            stackAsCards[notGhostIndex] = nextDeckCard.modifyPreviousCard(
              stackAsCards[notGhostIndex]
            );
          }
        } else {
          deckCard = nextDeckCard.modifyPreviousCard(deckCard);
        }
      }

      const operationSnippet =
        (deckCard.operation ??
          `${
            deckCard.value === 0 || deckCard.value
              ? `${deckCard.value >= 0 ? "+" : ""}${deckCard.value}`
              : ""
          }`) + " ";
      operation += ` ${operationSnippet}`;
    });

    let megaOperation = "";
    operation.split(".").forEach((_operation) => {
      const sanitizedOperation = math
        .parse(equationSanitizer(removeTrailingOperations(_operation)))
        .toString({ parenthesis: "all" });
      if (sanitizedOperation.match(/\d/g)) {
        megaOperation += ` +(${sanitizedOperation})`;
      }
    });

    console.log(`current operation ${this.#player.uid}: ${megaOperation}`);
    return this.#points.push(math.evaluate(megaOperation) ?? 0);
  }

  getPoints() {
    return this.#points.slice(-1)[0];
  }
}
