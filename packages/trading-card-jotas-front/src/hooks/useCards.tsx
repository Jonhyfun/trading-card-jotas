//TODO deprecate for server components and suspense
"use client";

import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export type BackendCard = {
  key: string;
  label: string;
  value?: number;
  desc?: string;
  limit: 1 | 2 | 3;
  src: string;
  ghost?: boolean;
};

const cardsAtom = atom<{ cards: BackendCard[]; isCardsLoading: boolean }>({
  cards: [],
  isCardsLoading: true,
});

export const useCards = () => {
  const cards = useAtomValue(cardsAtom);

  return cards;
};

export const useCardsLoad = () => {
  const setCards = useSetAtom(cardsAtom);

  const { isLoading, error, data } = useQuery<BackendCard[]>({
    initialData: [],
    queryKey: ["repoData"],
    staleTime: 1000 * 60 * 60, // 1 hour in ms
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards`)
        .then((stream) => stream.json())
        .then(({ data }) => data as BackendCard[]),
  });

  const loadCards = useCallback((cards: BackendCard[]) => {
    setCards((current) => ({ ...current, cards }));
  }, []);

  const setLoading = useCallback((isCardsLoading: boolean) => {
    setCards((current) => ({ ...current, isCardsLoading }));
  }, []);

  useEffect(() => {
    loadCards(data ?? []);
  }, [data, loadCards]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return {
    cardsLoading: isLoading,
    cards: data,
  };
};
