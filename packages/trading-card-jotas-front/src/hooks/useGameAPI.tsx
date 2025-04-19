import type { Cards } from "trading-card-jotas-types/cards";
import { useCallback } from "react";

export function useGameAPI() {
  const getDeck = useCallback(
    (token: string): Promise<{ cards: Cards[] }> =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/deck`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      }).then(async (response) => {
        if (response.status === 204) return { cards: [] };
        return (await response.json()) as { cards: Cards[] };
      }),
    []
  );

  const saveDeck = useCallback(
    (deck: Cards[], token: string) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/deck`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deck),
      }).then((response) => response.json() as { success?: string }),
    []
  );

  return { getDeck, saveDeck };
}
