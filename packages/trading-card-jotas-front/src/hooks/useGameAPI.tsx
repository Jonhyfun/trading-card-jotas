import type { Cards } from "trading-card-jotas-types/cards/types";
import { useCallback } from "react";

export function useGameAPI() {
  const saveDeck = useCallback(
    (deck: Cards[], token: string) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/setDeck`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deck),
      }).then((stream) => stream.json()),
    []
  );

  return { saveDeck };
}
